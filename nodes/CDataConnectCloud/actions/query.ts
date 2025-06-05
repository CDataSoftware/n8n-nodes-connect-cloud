import { IExecuteFunctions, INodeExecutionData, IRequestOptions, NodeOperationError } from 'n8n-workflow';
import { processQueryResponse } from '../utils/responseProcessors';

/**
 * Executes a SQL query against CData Connect Cloud
 */
export async function executeQuery(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const query = this.getNodeParameter('query', index) as string;
	const defaultSchema = this.getNodeParameter('defaultSchema', index) as string;
	const schemaOnly = this.getNodeParameter('schemaOnly', index) as boolean;
	const workspace = this.getNodeParameter('workspace', index) as string;
	const parameters = this.getNodeParameter('parameters', index) as any;

	const body: any = {
		query,
	};

	if (defaultSchema) {
		body.defaultSchema = defaultSchema;
	}

	if (schemaOnly) {
		body.schemaOnly = schemaOnly;
	}

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
		url: '/query',
		body,
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
