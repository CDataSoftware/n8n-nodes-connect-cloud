import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ConnectCloudQueryApi implements ICredentialType {
  displayName = 'Connect Cloud API';
  name = 'connectCloudApi';
  version = 1;
  // Define globally available credentials
  scope = ['global'];

  // Define the credentials properties
  properties: INodeProperties[] = [
    {
      displayName: 'Username (Email)',
      name: 'username',
      type: 'string',
      default: '',
      placeholder: 'user@cdata.com',
      required: true,
      description: 'The username used for authentication, formatted as an email address',
    },
    {
      displayName: 'Personal Access Token (PAT)',
      name: 'token',
      type: 'string',
      typeOptions: {
        password: true, // This will hide the token for security purposes
      },
      default: '',
      required: true,
      description: 'The Personal Access Token (PAT) for Connect Cloud authentication',
    },
  ];
}
