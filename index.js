var CWSC = function(uri, maxAttempts = 1, {onOpen = () => {}, onMessage = () => {}, onClose = () => {}} = {}) {
    this.maxAttempts = maxAttempts;
    this._attempted = 0;
    this._uri = uri;
    
    this.onUserOpen = onOpen;
    this.onUserMessage = onMessage;
    this.onUserClose = onClose;
    
    if (!this.connect(uri)) {
        console.error("Socket state is CLOSED");
    }
}

//Methods
CWSC.prototype.sendMessage = function(msg) {
    console.debug("sendMessage", msg);
    this._ws.send(msg + "\n\x00");
}
CWSC.prototype.connect = function(uri) {
    this._ws = new WebSocket(uri);//"GET"
    this._attempted++;
    
    if (this._ws.readyState != WebSocket.CLOSED) {
        this._ws.addEventListener("open", this.onOpen.bind(this));
        this._ws.addEventListener("close", this.onClose.bind(this));
        this._ws.addEventListener("message", this.onMessage.bind(this));
        this._ws.addEventListener("error", this.onError.bind(this));
        return true;
    } else {
        return false;
    }
}
CWSC.prototype.disconnect = function() {
    this._ws.close();
    //TODO Remove listeners?
}

//Listeners, don't touch
CWSC.prototype.onOpen = function(evt) {
    console.debug("onOpen", evt);
    this.onUserOpen(evt);
}
CWSC.prototype.onClose = function(evt) {
    console.debug("onClose", evt);
    this.onUserClose(evt);
}
CWSC.prototype.onMessage = function(evt) {
    console.debug("onMessage", evt);
    this.onUserMessage(evt);
}
CWSC.prototype.onError = function(evt) {
    console.debug("onError", evt);
    if (this._attempted < this.maxAttempts) {
        console.error("Error: Connection failed. Retrying.");
        this.connect(this._uri);
    } else {
        console.error("Error: Connection failed. Max connection attempt is reached. Quitting.");
        this.disconnect();
    }
}
