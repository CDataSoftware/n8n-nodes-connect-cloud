import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CDataConnectCloudApi implements ICredentialType {
	name = 'cDataConnectCloudApi';
	displayName = 'CData Connect Cloud API';
	documentationUrl = 'https://cloud.cdata.com/docs/REST-API.html';
	properties: INodeProperties[] = [
		{
			displayName: 'Username (Email)',
			name: 'username',
			type: 'string',
			placeholder: 'user@example.com',
			default: '',
			required: true,
			description: 'Your CData Connect Cloud email address',
		},
		{
			displayName: 'Personal Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Personal Access Token (PAT) generated from CData Connect Cloud Settings page',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://cloud.cdata.com/api',
			required: true,
			description: 'The base URL for CData Connect Cloud API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/metadata',
			method: 'GET',
		},
	};
}