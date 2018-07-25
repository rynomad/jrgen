class RPCClient {
  constructor(url, username, password) {
    this.username = username
    this.password = password
    this.url = url;
  }

  request(method, params) {
    return new Promise((resolve, reject) => {
      let headers
      if (this.username && this.password) {
        headers = new Headers();
        headers.append('Authorization', 'Basic ' + Buffer.from(this.username + ":" + this.password).toString('base64'));
      }
      
      fetch(this.url, {
        method: "post",
        headers,
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Math.random()
            .toString(16)
            .slice(2),
          method: method,
          params: params
        })
      })
        .then(response => {
          if (response.ok) {
            response.json().then(rpcResponse => {
              if ("error" in rpcResponse) {
                const error = {
                  message : rpcResponse.error
                }
                this.help({ command : method })
                  .then(({ help }) => {
                    error.help = help
                    reject(error);
                  })
                  .catch(error => {
                    reject(error);
                  });
              } else {
                resolve(rpcResponse.result);
              }
            });
          } else {
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
        .catch(error => {
          console.log(error)
          reject({
            code: -1,
            message: "Network error"
          });
        });
    });
  }

{{CONTENT}}

}

module.exports = RPCClient;
