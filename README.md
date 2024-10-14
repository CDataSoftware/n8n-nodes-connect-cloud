# n8n-nodes-connect-cloud

This is an n8n community node. It lets you use Connect Cloud in your n8n workflows.

Connect Cloud is a platform that allows you to connect to various data sources and execute SQL queries against them.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Execute SQL queries against the Connect Cloud API

## Credentials

To use this node, you need to authenticate with the Connect Cloud API. You will need the following credentials:
- **Username (Email)**: The username used for authentication, formatted as an email address.
- **Personal Access Token (PAT)**: The Personal Access Token (PAT) for Connect Cloud authentication.

## Compatibility

This node is compatible with n8n version 1 and above. It has been tested with the latest version of n8n.

## Usage

To use this node, you need to provide the SQL query you want to execute, along with optional parameters such as the default schema, whether to return only schema information, and any query parameters in JSON format.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Connect Cloud documentation](https://www.cdata.com/cloud/)

## Version history

### 0.1.0
- Initial release
### 0.1.1
- Minor bug fixes
