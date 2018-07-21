class RPCClient {

  constructor(url) {
    this.url = url;
  }

  request(method, params) {

    return new Promise((resolve, reject) => {

      fetch(this.url, {
          method: 'post',
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Math.random().toString(16).slice(2),
            method: method,
            params: params
          }),
        }).then((response) => {
          if (response.ok) {
            response.json().then((rpcResponse) => {
              if ("error" in rpcResponse) {
                this.help({method}).then((({help}) => {
                  console.log(`Correct usage for ${method}:`)
                  console.log(help)
                  reject(rpcResponse.error);
                })).catch(error => {
                  reject(rpcResponse.error)
                })
              }
              else {
                resolve(rpcResponse.result);
              }
            });
          }
          else {
            reject({
              code: -1,
              message: "Network error",
              data: {
                statusCode: response.status,
                statusText: response.statusText
              }
            });
          }
        })
        .catch((error) => {
          reject({
            code: -1,
            message: "Network error"
          });
        });
    });
  };

{{CONTENT}}

}

module.exports = RPCClient;
