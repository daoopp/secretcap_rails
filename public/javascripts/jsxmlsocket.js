/* jsxmlsocket.js
 * The MIT License
 *
 * Copyright (c) 2009 Christiaan Baartse <christiaan@baartse.nl>
 * Copyright (c) 2009 Erik Rigtorp <erik@rigtorp.com>
 * Copyright (c) 2008 Tjeerd Jan 'Aidamina' van der Molen
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Construct
 * @param onReady When the socket is added the to document and the swf is loaded
 * @param onConnect Connection attempt finished
 * @param onData Received data
 * @param onClose Server closed socket
 */
function jsXMLSocket(onReady, onConnect, onData, onClose)
{
	this.onReady = onReady;
	this.onConnect = onConnect;
	this.onData = onData;
	this.onClose = onClose;
	
	this.id = "jsXMLSocket_"+ (++jsXMLSocket.last_id);
	jsXMLSocket.sockets[this.id] = this;     

	// Unused variable name used in flash for testing
	// Should use jSocket.variableTest = 'whatever' 
	// If you are using a variable 'xt' in your flashmovie
	this.variableTest ='xt';     
	// Connection state
	this.connected = false;  
}

/**
 * Object used as array with named keys to
 * keep references to the instantiated sockets
 * @var Object
 */
jsXMLSocket.sockets = {};

/**
 * Id used to generate a unique id for the embedded swf
 * @var int
 */
jsXMLSocket.last_id = 0;

/**
 * Find the embedded SWF
 * @return DOMnode
 */
jsXMLSocket.prototype.getSwf = function(){
	if (window.document[this.id]){
		return window.document[this.id];
	}
	if (document.embeds && document.embeds[this.id]){
		return document.embeds[this.id]; 
    }
    return document.getElementById(this.id);
}

/**
 * Insert the SWF into the DOM
 * @param target ID of domnode that will be replaced with the embedded SWF
 * @param swflocation Location of the jsxmlsocket.swf
 * @return {@swfobject.embedSWF}
 */
jsXMLSocket.prototype.setup = function(target, swflocation)
{
	if(typeof(swfobject) == 'undefined')
		throw 'SWFObject not found! Please download from http://code.google.com/p/swfobject/';
    if(this.target)
    	throw 'Can only call setup on a jsXMLSocket Object once.';
    this.target = target; 
    
    // Add the object to the dom
    return swfobject.embedSWF(
    	swflocation+"?"+this.id,
    	target,
    	"0", // width
    	"0", // height
    	"9.0.0",
    	"expressInstall.swf",
    	// Flashvars
    	{},
    	// Params
    	{'menu' : "false", "allowScriptAccess": 'always', 'swliveconnect': 'true', 'movie': swflocation+"?"+this.id, "quantity": "low"},
    	// Attributes
    	{'id':this.id, 'name':this.id}
    );
}

/**
 * Connect to a listening socket
 * @param host hostname/ip to connect to
 * @param port tcp/ip port to connect on
 */
jsXMLSocket.prototype.connect = function(host,port){    
    if(!this.movie)
        throw "jsXMLSocket isn't ready yet, use the onReady event";
    if(this.connected)
        this.movie.close();
    this.movie.connect(host, port);     
}

/**
 * Close the socket connection (onClose event does NOT get called)
 */
jsXMLSocket.prototype.close = function(){
    this.connected = false;
    if(this.movie)
        this.movie.close();    
}

/**
 * Send data to the server
 * @param data
 * @return void
 */
jsXMLSocket.prototype.send = function(data)
{
    if(!this.connected||!this.movie)
    	throw "jsXMLSocket is not connected, use the onConnect event ";
    this.movie.send(data);
}

/**
 * Callback that the flash object calls
 * @param name	What callback is called
 * @param id	Id of the socket
 * @param data	Used for data and errors
 */
jsXMLSocket.flashCallback = function(name, id, data)
{
	var socket = jsXMLSocket.sockets[id];
	
	switch (name) {
		// Callback for the flash object to signal the flash file is loaded
		// triggers jsXMLSocket.onReady
		case 'init':
			var v = socket.variableTest;
		    // Wait until we can actually set Variables in flash
		    var f = function(){
		        var err = true;
			    try{
			        // Needs to be in the loop, early results might fail, when DOM hasn't updated yet
			        var m = socket.getSwf();
		            m.SetVariable(v, 't');
		            if('t' != m.GetVariable(v))
		                throw null;
		            m.SetVariable(v, '');
		            // Store the found movie for later use
		            socket.movie = m; 
		            err=false;
		        }
		        catch(e){ 
		            window.setTimeout(f,0);
		        }
		        // Fire the event
		        if(!err&&socket.onReady)
		        	socket.onReady();
		    }
		    window.setTimeout(f,0);
		break;
		
		// Callback for the flash object to signal data is received
		// triggers jsXMLSocket.onData
		case 'data':
		    if(socket.onData)
		    	socket.onData(data);
		break;
	
		// Callback for the flash object to signal the connection attempt is finished
		// triggers jsXMLSocket.onConnect
		case 'connect':
		    socket.connected = true;
		    if(socket.onConnect)
		        socket.onConnect(true);
		break;
		
		// Callback for the flash object to signal the connection attempt is finished
		// triggers jsXMLSocket.onConnect
		case 'error':
			if(socket.onConnect)
		        socket.onConnect(false,data);
		break;
		
		// Callback for the flash object to signal the connection was closed from the other end
		// triggers jsXMLSocket.onClose
		case 'close':
		    socket.connected = false;
		    if(socket.onClose)
		        socket.onClose();
		break;
		
		default:
			throw "jsXMLSocket: unknown callback used";
	}
}
