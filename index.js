const CWSC = function(uri, maxAttempts) {
    this.maxAttempts = maxAttempts || 1;
    this._attempted = 0;
    this._uri = uri;
    this.connect(uri);
}
//Listeners, don't touch
CWSC.prototype.onOpen = function(evt) {
    console.debug("onOpen", evt);
}
CWSC.prototype.onClose = function(evt) {
    console.debug("onClose", evt);
}
CWSC.prototype.onMessage = function(evt) {
    console.debug("onMessage", evt);
}
CWSC.prototype.onError = function(evt) {
    console.debug("onError", evt);
    if (this._attempted < this.maxAttempts) {
        console.error("Error: Connection failed. Retrying.");
        this.attempted++;
        this.connect(this._uri);
    } else {
        console.error("Error: Connection failed. Max connection attempt is reached. Quitting.");
        this.disconnect();
    }
}
//Methods
CWSC.prototype.sendMessage = function(msg) {
    console.debug("sendMessage", msg);
    this._ws.send(msg, "\x00");
}
CWSC.prototype.connect = function(uri) {
    this._ws = new WebSocket(uri);
    
    this._ws.addEventListener("open", this.onOpen};
    this._ws.addEventListener("close", this.onClose};
    this._ws.addEventListener("message", this.onMessage};
    this._ws.addEventListener("error", this.onError};
}
CWSC.prototype.disconnect = function() {
    this._ws.close();
    //TODO Remove listeners?
}
