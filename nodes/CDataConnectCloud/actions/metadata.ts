import { IExecuteFunctions, INodeExecutionData, IRequestOptions, NodeOperationError } from 'n8n-workflow';
import { processQueryResponse } from '../utils/responseProcessors';

/**
 * Executes metadata queries against CData Connect Cloud
 */
export async function executeMetadata(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const workspace = this.getNodeParameter('workspace', index) as string;
	const catalogName = this.getNodeParameter('catalogName', index, '') as string;
	const schemaName = this.getNodeParameter('schemaName', index, '') as string;
	const tableName = this.getNodeParameter('tableName', index, '') as string;

	let endpoint = '';
	const qs: any = {};

	switch (operation) {
		case 'getCatalogs':
			endpoint = '/catalogs';
			break;
		case 'getSchemas':
			endpoint = '/schemas';
			if (catalogName) qs.catalogName = catalogName;
			break;
		case 'getTables':
			endpoint = '/tables';
			if (catalogName) qs.catalogName = catalogName;
			if (schemaName) qs.schemaName = schemaName;
			break;
		case 'getColumns':
			endpoint = '/columns';
			if (catalogName) qs.catalogName = catalogName;
			if (schemaName) qs.schemaName = schemaName;
			if (tableName) qs.tableName = tableName;
			break;
		case 'getProcedures':
			endpoint = '/procedures';
			if (catalogName) qs.catalogName = catalogName;
			if (schemaName) qs.schemaName = schemaName;
			break;
	}

	if (workspace) {
		qs.workspace = workspace;
	}

	const options: IRequestOptions = {
		method: 'GET',
		url: endpoint,
		qs,
		json: true,
	};

	const response = await this.helpers.requestWithAuthentication.call(this, 'cDataConnectCloudApi', options);

	if (response.error) {
		throw new NodeOperationError(this.getNode(), `CData Connect Cloud error: ${response.error.message}`, {
			itemIndex: index,
		});
	}

	return processQueryResponse(response);
}
