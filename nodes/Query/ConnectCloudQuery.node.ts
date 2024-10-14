import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeApiError } from 'n8n-workflow';
import axios from 'axios';

export class Query implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Connect Cloud Query',
		name: 'connectCloudQuery',
		group: ['query'],
		version: 1,
		description: 'Executes a query against the Connect Cloud API',
		defaults: {
			name: 'Connect Cloud Query',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'connectCloudApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				required: true,
				default: '',
				description: 'The SQL query to execute',
			},
			{
				displayName: 'Default Schema',
				name: 'defaultSchema',
				type: 'string',
				default: '',
				description: 'The default schema to use for the query',
			},
			{
				displayName: 'Schema Only',
				name: 'schemaOnly',
				type: 'boolean',
				default: false,
				description: 'Whether only schema information will be returned',
			},
			{
				displayName: 'Parameters',
				name: 'parameters',
				type: 'json',
				default: '{}',
				description: 'Query parameters in JSON format',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const credentials = await this.getCredentials('connectCloudApi');
		const query = this.getNodeParameter('query', 0) as string;
		const defaultSchema = this.getNodeParameter('defaultSchema', 0, null) as string | null;
		const schemaOnly = this.getNodeParameter('schemaOnly', 0, false) as boolean;
		const parameters = this.getNodeParameter('parameters', 0, {}) as object;

		const username = credentials.username as string;
		const token = credentials.token as string;

		// Execute the query and return the results
		const results = await executeQuery(query, username, token, defaultSchema, schemaOnly, parameters);

		// Return the results in the correct format for n8n
		return [this.helpers.returnJsonArray(results)];
	}
}

// Function to execute the query against the Connect Cloud API
async function executeQuery(this: any,
	query: string,
	username: string,
	token: string,
	defaultSchema: string | null = null,
	schemaOnly: boolean = false,
	parameters: object = {},
): Promise<any> {
	try {
		// Basic Auth encoding
		const credentials = `${username}:${token}`;
		const encodedCredentials = Buffer.from(credentials).toString('base64');

		// Set up the request headers
		const headers = {
			'Authorization': `Basic ${encodedCredentials}`,
			'Content-Type': 'application/json',
		};

		// Prepare the request body
		const requestBody: { query: string; defaultSchema?: string | null; schemaOnly?: boolean; parameters?: object } = {
			query,
		};

		// Optional fields
		if (defaultSchema) requestBody.defaultSchema = defaultSchema;
		if (schemaOnly) requestBody.schemaOnly = schemaOnly;
		if (Object.keys(parameters).length > 0) requestBody.parameters = parameters;

		// Send the POST request to the Connect Cloud API
		const response = await axios.post('https://cloud.cdata.com/api/query', requestBody, { headers });

		const data = response.data;

		// Check if the response contains an error
		if (data.error) {
			throw new NodeApiError(this.getNode(), data);
		}

		// Return the results
		return data.results;
	} catch (error) {
		console.error('Error executing query:', error.message);
		throw new NodeApiError(this.getNode(), error);
	}
}
