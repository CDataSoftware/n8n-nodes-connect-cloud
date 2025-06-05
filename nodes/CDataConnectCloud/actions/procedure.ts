import { IExecuteFunctions, INodeExecutionData, IRequestOptions, NodeOperationError } from 'n8n-workflow';
import { processQueryResponse } from '../utils/responseProcessors';

/**
 * Executes stored procedures against CData Connect Cloud
 */
export async function executeStoredProcedure(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const procedureName = this.getNodeParameter('procedureName', index) as string;
	const parameters = this.getNodeParameter('parameters', index) as any;

	const body: any = {
		procedure: procedureName,
	};

	if (parameters && parameters.parameter) {
		body.parameters = {};
		for (const param of parameters.parameter) {
			body.parameters[param.name] = {
				dataType: param.dataType,
				value: param.value,
			};
		}
	}

	const options: IRequestOptions = {
		method: 'POST',
		url: '/exec',
		body,
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
