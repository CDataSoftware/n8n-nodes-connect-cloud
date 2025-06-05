import { IExecuteFunctions, INodeExecutionData, IRequestOptions, NodeOperationError } from 'n8n-workflow';
import { processQueryResponse } from '../utils/responseProcessors';

/**
 * Executes batch operations against CData Connect Cloud
 */
export async function executeBatch(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const batchOperations = this.getNodeParameter('batchOperations', index) as string;
	const workspace = this.getNodeParameter('workspace', index) as string;

	let operations;
	try {
		operations = JSON.parse(batchOperations);
	} catch (error) {
		throw new NodeOperationError(this.getNode(), 'Invalid JSON in batch operations', {
			itemIndex: index,
		});
	}

	const options: IRequestOptions = {
		method: 'POST',
		url: '/batch',
		body: operations,
		json: true,
	};

	if (workspace) {
		options.qs = { workspace };
	}

	const response = await this.helpers.requestWithAuthentication.call(this, 'cDataConnectCloudApi', options);

	if (response.error) {
		throw new NodeOperationError(this.getNode(), `CData Connect Cloud error: ${response.error.message}`, {
			itemIndex: index,
		});
	}

	return processQueryResponse(response);
}
