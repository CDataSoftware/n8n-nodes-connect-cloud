import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

// Import the refactored functions
import {
	executeQuery,
	executeMetadata,
	executeBatch,
	executeStoredProcedure
} from './actions';

export class CDataConnectCloud implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CData Connect Cloud',
		name: 'cDataConnectCloud',
		icon: 'file:cdata.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with CData Connect Cloud API',
		defaults: {
			name: 'CData Connect Cloud',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'cDataConnectCloudApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Query',
						value: 'query',
						description: 'Execute SQL queries against data sources',
					},
					{
						name: 'Metadata',
						value: 'metadata',
						description: 'Retrieve metadata about data sources',
					},
					{
						name: 'Batch',
						value: 'batch',
						description: 'Perform batch operations',
					},
					{
						name: 'Execute',
						value: 'execute',
						description: 'Execute stored procedures',
					},
				],
				default: 'query',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['query'],
					},
				},
				options: [
					{
						name: 'Execute Query',
						value: 'executeQuery',
						description: 'Execute a SQL query',
						action: 'Execute a SQL query',
					},
				],
				default: 'executeQuery',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['metadata'],
					},
				},
				options: [
					{
						name: 'Get Catalogs',
						value: 'getCatalogs',
						description: 'Retrieve available catalogs',
						action: 'Get catalogs',
					},
					{
						name: 'Get Columns',
						value: 'getColumns',
						description: 'Retrieve table columns',
						action: 'Get columns',
					},
					{
						name: 'Get Procedures',
						value: 'getProcedures',
						description: 'Retrieve stored procedures',
						action: 'Get procedures',
					},
					{
						name: 'Get Schemas',
						value: 'getSchemas',
						description: 'Retrieve available schemas',
						action: 'Get schemas',
					},
					{
						name: 'Get Tables',
						value: 'getTables',
						description: 'Retrieve available tables',
						action: 'Get tables',
					},
				],
				default: 'getCatalogs',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['batch'],
					},
				},
				options: [
					{
						name: 'Execute Batch',
						value: 'executeBatch',
						description: 'Execute multiple operations in a batch',
						action: 'Execute batch operations',
					},
				],
				default: 'executeBatch',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['execute'],
					},
				},
				options: [
					{
						name: 'Execute Procedure',
						value: 'executeProcedure',
						description: 'Execute a stored procedure',
						action: 'Execute stored procedure',
					},
				],
				default: 'executeProcedure',
			},
			// Query parameters
			{
				displayName: 'SQL Query',
				name: 'query',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['query'],
						operation: ['executeQuery'],
					},
				},
				default: '',
				placeholder: 'SELECT * FROM Salesforce1.Salesforce.Account LIMIT 10',
				required: true,
				description: 'The SQL query to execute',
			},
			{
				displayName: 'Default Schema',
				name: 'defaultSchema',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['query'],
						operation: ['executeQuery'],
					},
				},
				default: '',
				description: 'Default schema to use for the query',
			},
			{
				displayName: 'Schema Only',
				name: 'schemaOnly',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['query'],
						operation: ['executeQuery'],
					},
				},
				default: false,
				description: 'Whether to return only schema information without data',
			},
			{
				displayName: 'Workspace',
				name: 'workspace',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['query', 'metadata', 'batch'],
					},
				},
				default: '',
				description: 'Workspace name to query (optional)',
			},
			// Metadata parameters
			{
				displayName: 'Catalog Name',
				name: 'catalogName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['metadata'],
						operation: ['getSchemas', 'getTables', 'getColumns', 'getProcedures'],
					},
				},
				default: '',
				description: 'Optional catalog name to filter by',
			},
			{
				displayName: 'Schema Name',
				name: 'schemaName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['metadata'],
						operation: ['getTables', 'getColumns', 'getProcedures'],
					},
				},
				default: '',
				description: 'Optional schema name to filter by',
			},
			{
				displayName: 'Table Name',
				name: 'tableName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['metadata'],
						operation: ['getColumns'],
					},
				},
				default: '',
				description: 'Optional table name to filter by',
			},
			// Batch parameters
			{
				displayName: 'Batch Operations',
				name: 'batchOperations',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['batch'],
						operation: ['executeBatch'],
					},
				},
				default: '[]',
				description: 'Array of operations to execute in batch',
				placeholder: '[{"query": "INSERT INTO table VALUES (1, \'value\')"}, {"query": "UPDATE table SET col=\'new\' WHERE ID=1"}]',
			},
			// Execute parameters
			{
				displayName: 'Procedure Name',
				name: 'procedureName',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['execute'],
						operation: ['executeProcedure'],
					},
				},
				default: '',
				required: true,
				description: 'Name of the stored procedure to execute',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						resource: ['execute', 'query'],
					},
				},
				default: {},
				description: 'Parameters for the procedure or query',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'parameter',
						displayName: 'Parameter',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
								description: 'Parameter name (must start with @)',
								placeholder: '@param1',
							},
							{
								displayName: 'Data Type',
								name: 'dataType',
								type: 'options',
								options: [
									{ name: 'VARCHAR', value: 5 },
									{ name: 'INTEGER', value: 8 },
									{ name: 'BIGINT', value: 9 },
									{ name: 'DOUBLE', value: 11 },
									{ name: 'DECIMAL', value: 12 },
									{ name: 'BOOLEAN', value: 14 },
									{ name: 'DATE', value: 15 },
									{ name: 'TIMESTAMP', value: 17 },
								],
								default: 5,
								description: 'Data type of the parameter',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description: 'Parameter value',
							},
						],
					},
				],
			},
			// Additional options
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add Field',
				default: {},
				options: [
					{
						displayName: 'Request Timeout',
						name: 'timeout',
						type: 'number',
						default: 30000,
						description: 'Request timeout in milliseconds',
					},
					{
						displayName: 'Max Rows',
						name: 'maxRows',
						type: 'number',
						default: 1000,
						description: 'Maximum number of rows to return',
					},
				],
			},
		],
	};	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'query') {
					responseData = await executeQuery.call(this, i);
				} else if (resource === 'metadata') {
					responseData = await executeMetadata.call(this, i);
				} else if (resource === 'batch') {
					responseData = await executeBatch.call(this, i);
				} else if (resource === 'execute') {
					responseData = await executeStoredProcedure.call(this, i);
				}

				if (Array.isArray(responseData)) {
					returnData.push(...responseData);
				} else if (responseData) {
					returnData.push({ json: responseData });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
