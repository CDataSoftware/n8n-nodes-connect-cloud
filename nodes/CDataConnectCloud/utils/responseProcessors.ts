import { INodeExecutionData, NodeOperationError } from 'n8n-workflow';

/**
 * Processes the query response from CData Connect Cloud API and formats it into n8n compatible data
 */
export function processQueryResponse(response: any): INodeExecutionData[] {
	const returnData: INodeExecutionData[] = [];

	if (response.results && Array.isArray(response.results)) {
		for (const result of response.results) {
			if (result.rows && Array.isArray(result.rows)) {
				// Convert rows to objects using schema
				const schema = result.schema || [];
				for (const row of result.rows) {
					const item: any = {};
					row.forEach((value: any, index: number) => {
						const column = schema[index];
						if (column) {
							item[column.columnName] = value;
						} else {
							item[`column_${index}`] = value;
						}
					});
					returnData.push({ json: item });
				}
			} else {
				// No rows, return schema or result info
				returnData.push({
					json: {
						schema: result.schema,
						affectedRows: result.affectedRows,
					},
				});
			}
		}
	} else {
		// Return the raw response if it doesn't match expected format
		returnData.push({ json: response });
	}

	return returnData;
}
