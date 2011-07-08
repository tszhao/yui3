YUI.add("controller",function(a){var h=a.HistoryHash,e=a.Lang,b=a.QueryString,j=a.Array,f=a.HistoryBase.html5&&(!a.UA.android||a.UA.android>=3),g=a.config.win,k=g.location,i=[],d="ready";function c(){c.superclass.constructor.apply(this,arguments);}a.Controller=a.extend(c,a.Base,{html5:f,root:"",routes:[],_regexPathParam:/([:*])([\w-]+)/g,_regexUrlQuery:/\?([^#]*).*$/,initializer:function(m){var l=this;m||(m={});m.routes&&(l.routes=m.routes);e.isValue(m.root)&&(l.root=m.root);l._routes=[];j.each(l.routes,function(n){l.route(n.path,n.callback);});if(f){l._history=new a.HistoryHTML5({force:true});l._history.after("change",l._afterHistoryChange,l);}else{a.on("hashchange",l._afterHistoryChange,g,l);}l.publish(d,{defaultFn:l._defReadyFn,fireOnce:true,preventable:false});l.once("initializedChange",function(){setTimeout(function(){l.fire(d,{dispatched:!!l._dispatched});},20);});},destructor:function(){if(f){this._history.detachAll();}else{a.detach("hashchange",this._afterHistoryChange,g);}},dispatch:function(){this.once(d,function(){var l=this._getHashPath();this._ready=true;if(f&&l&&l.charAt(0)==="/"){this._history.replace(null,{url:this._joinURL(l)});}else{this._dispatch(this._getPath());}});return this;},match:function(l){return j.filter(this._routes,function(m){return l.search(m.regex)>-1;});},replace:function(l){return this._queue(l,true);},route:function(m,n){var l=[];this._routes.push({callback:n,keys:l,path:m,regex:this._getRegex(m,l)});return this;},save:function(l){return this._queue(l);},_decode:function(l){return decodeURIComponent(l.replace(/\+/g," "));},_dequeue:function(){var l=this,m;if(!YUI.Env.windowLoaded){a.once("load",function(){l._dequeue();});return this;}m=i.shift();return m?m():this;},_dispatch:function(p){var m=this,l=m.match(p),o;m._dispatching=m._dispatched=true;if(!l||!l.length){return m;}o=m._getRequest(p);function n(r){var t,s,q;if(r){a.error(r);}else{if((q=l.shift())){s=q.regex.exec(p);t=typeof q.callback==="string"?m[q.callback]:q.callback;if(s.length===q.keys.length+1){o.params=j.hash(q.keys,s.slice(1));}else{o.params=s.concat();}t.call(m,o,n);}}}n();m._dispatching=false;return m._dequeue();},_getHashPath:function(){return h.getHash().replace(this._regexUrlQuery,"");},_getPath:f?function(){return this._removeRoot(k.pathname);}:function(){return this._getHashPath()||this._removeRoot(k.pathname);},_getQuery:f?function(){return k.search.substring(1);}:function(){var m=h.getHash(),l=m.match(this._regexUrlQuery);return m&&l?l[1]:k.search.substring(1);},_getRegex:function(m,l){if(m instanceof RegExp){return m;}m=m.replace(this._regexPathParam,function(o,n,p){l.push(p);return n==="*"?"(.*?)":"([^/]*)";});return new RegExp("^"+m+"$");},_getRequest:function(l){return{path:l,query:this._parseQuery(this._getQuery())};},_joinURL:function(m){var l=this.root;if(m.charAt(0)==="/"){m=m.substring(1);}return l&&l.charAt(l.length-1)==="/"?l+m:l+"/"+m;},_parseQuery:b&&b.parse?b.parse:function(o){var p=this._decode,r=o.split("&"),n=0,m=r.length,l={},q;for(;n<m;++n){q=r[n].split("=");if(q[0]){l[p(q[0])]=p(q[1]||"");}}return l;},_queue:function(){var m=arguments,l=this;i.push(function(){if(f){setTimeout(function(){l._save.apply(l,m);},1);}else{l._dispatching=true;l._save.apply(l,m);}return this;});return !this._dispatching?this._dequeue():this;},_removeRoot:function(m){var l=this.root;if(l&&m.indexOf(l)===0){m=m.substring(l.length);}return m.charAt(0)==="/"?m:"/"+m;},_save:f?function(l,m){this._ready=true;this._history[m?"replace":"add"](null,{url:typeof l==="string"?this._joinURL(l):l});return this;}:function(l,m){this._ready=true;if(typeof l==="string"&&l.charAt(0)!=="/"){l="/"+l;}h[m?"replaceHash":"setHash"](l);return this;},_afterHistoryChange:function(m){var l=this;if(l._ready){l._dispatch(l._getPath());}},_defReadyFn:function(l){this._ready=true;}},{NAME:"controller"});},"@VERSION@",{optional:["querystring-parse"],requires:["array-extras","base-build","history"]});YUI.add("model",function(g){var c=YUI.namespace("Env.Model"),e=g.Lang,d=g.Array,h=g.Object,a="change",b="error";function f(){f.superclass.constructor.apply(this,arguments);}g.Model=g.extend(f,g.Base,{idAttribute:"id",initializer:function(i){this.changed={};this.lastChange={};this.lists=[];},destroy:function(j,l){var i=this;if(typeof j==="function"){l=j;j={};}function k(m){if(!m){d.each(i.lists,function(n){n.remove(i,j);});f.superclass.destroy.call(i);}l&&l.apply(null,arguments);}if(j&&j["delete"]){this.sync("delete",j,k);}else{k();}return this;},generateClientId:function(){c.lastId||(c.lastId=0);return this.constructor.NAME+"_"+(c.lastId+=1);},getAsHTML:function(i){var j=this.get(i);return g.Escape.html(e.isValue(j)?String(j):"");},getAsURL:function(i){var j=this.get(i);return encodeURIComponent(e.isValue(j)?String(j):"");},isModified:function(){return this.isNew()||!h.isEmpty(this.changed);},isNew:function(){return !e.isValue(this.get("id"));},load:function(j,k){var i=this;if(typeof j==="function"){k=j;j={};}this.sync("read",j,function(m,l){if(!m){i.setAttrs(i.parse(l),j);i.changed={};}k&&k.apply(null,arguments);});return this;},parse:function(i){if(typeof i==="string"){try{return g.JSON.parse(i);}catch(j){this.fire(b,{error:j,response:i,src:"parse"});return null;}}return i;},save:function(j,k){var i=this;if(typeof j==="function"){k=j;j={};}this.sync(this.isNew()?"create":"update",j,function(m,l){if(!m){if(l){i.setAttrs(i.parse(l),j);}i.changed={};}k&&k.apply(null,arguments);});return this;},set:function(k,l,j){var i={};i[k]=l;return this.setAttrs(i,j);},setAttrs:function(i,j){var m=this.idAttribute,p,n,k,l,o;if(!this._validate(i)){return this;}j||(j={});o=j._transaction={};if(m!=="id"){i=g.merge(i);if(h.owns(i,m)){i.id=i[m];}else{if(h.owns(i,"id")){i[m]=i.id;}}}for(k in i){if(h.owns(i,k)){this._setAttr(k,i[k],j);}}if(!h.isEmpty(o)){p=this.changed;l=this.lastChange={};for(k in o){if(h.owns(o,k)){n=o[k];p[k]=n.newVal;l[k]={newVal:n.newVal,prevVal:n.prevVal,src:n.src||null};}}if(!j.silent){if(!this._changeEvent){this._changeEvent=this.publish(a,{preventable:false});
}this.fire(a,{changed:l});}}return this;},sync:function(){var i=d(arguments,0,true).pop();if(typeof i==="function"){i();}},toJSON:function(){var i=this.getAttrs();delete i.clientId;delete i.destroyed;delete i.initialized;if(this.idAttribute!=="id"){delete i.id;}return i;},undo:function(n,j){var m=this.lastChange,l=this.idAttribute,i={},k;n||(n=h.keys(m));d.each(n,function(o){if(h.owns(m,o)){o=o===l?"id":o;k=true;i[o]=m[o].prevVal;}});return k?this.setAttrs(i,j):this;},validate:function(){},addAttr:function(j,i,l){var m=this.idAttribute,k,n;if(m&&j===m){k=this._isLazyAttr("id")||this._getAttrCfg("id");n=i.value===i.defaultValue?null:i.value;if(!e.isValue(n)){n=k.value===k.defaultValue?null:k.value;if(!e.isValue(n)){n=e.isValue(i.defaultValue)?i.defaultValue:k.defaultValue;}}i.value=n;if(k.value!==n){k.value=n;if(this._isLazyAttr("id")){this._state.add("id","lazy",k);}else{this._state.add("id","value",n);}}}return f.superclass.addAttr.apply(this,arguments);},_validate:function(i){var j=this.validate(i);if(e.isValue(j)){this.fire(b,{attributes:i,error:j,src:"validate"});return false;}return true;},_defAttrChangeFn:function(j){var i=j.attrName;if(!this._setAttrVal(i,j.subAttrName,j.prevVal,j.newVal)){j.stopImmediatePropagation();}else{j.newVal=this.get(i);if(j._transaction){j._transaction[i]=j;}}}},{NAME:"model",ATTRS:{clientId:{valueFn:"generateClientId",readOnly:true},id:{value:null}}});},"@VERSION@",{requires:["base-build","escape","json-parse"]});YUI.add("model-list",function(g){var e=g.Lang,d=g.Array,c="add",f="refresh",a="remove";function b(){b.superclass.constructor.apply(this,arguments);}g.ModelList=g.extend(b,g.Base,{model:null,initializer:function(i){i||(i={});var h=this.model=i.model||this.model;this.publish(c,{defaultFn:this._defAddFn});this.publish(f,{defaultFn:this._defRefreshFn});this.publish(a,{defaultFn:this._defRemoveFn});if(h){this.after("*:idChange",this._afterIdChange);}else{}this._clear();},destructor:function(){d.each(this._items,this._detachList,this);},add:function(i,h){if(e.isArray(i)){return d.map(i,function(j){return this._add(j,h);},this);}else{return this._add(i,h);}},create:function(j,i,k){var h=this;if(typeof i==="function"){k=i;i={};}if(!(j instanceof g.Model)){j=new this.model(j);}return j.save(i,function(l){if(!l){h.add(j,i);}k&&k.apply(null,arguments);});},getByClientId:function(h){return this._clientIdMap[h]||null;},getById:function(h){return this._idMap[h]||null;},invoke:function(i){var h=[this._items,i].concat(d(arguments,1,true));return d.invoke.apply(d,h);},load:function(i,j){var h=this;if(typeof i==="function"){j=i;i={};}this.sync("read",i,function(l,k){if(!l){h.refresh(h.parse(k),i);}j&&j.apply(null,arguments);});return this;},map:function(h,i){return d.map(this._items,h,i);},parse:function(h){if(typeof h==="string"){try{return g.JSON.parse(h)||[];}catch(i){g.error("Failed to parse JSON response.");return null;}}return h||[];},refresh:function(j,h){h||(h={});var i=g.merge(h,{src:"refresh",models:d.map(j,function(k){return k instanceof g.Model?k:new this.model(k);},this)});h.silent?this._defRefreshFn(i):this.fire(f,i);return this;},remove:function(i,h){if(e.isArray(i)){return d.map(i,function(j){return this._remove(j,h);},this);}else{return this._remove(i,h);}},sort:function(i){var h=this.comparator,k=this._items.concat(),j;if(!h){return this;}i||(i={});k.sort(function(m,l){var o=h(m),n=h(l);return o<n?-1:(o>n?1:0);});j=g.merge(i,{models:k,src:"sort"});i.silent?this._defRefreshFn(j):this.fire(f,j);return this;},sync:function(){var h=d(arguments,0,true).pop();if(typeof h==="function"){h();}},toArray:function(){return this._items.concat();},toJSON:function(){return this.map(function(h){return h.toJSON();});},_add:function(i,h){var j;h||(h={});if(!(i instanceof g.Model)){i=new this.model(i);}if(this._clientIdMap[i.get("clientId")]){g.error("Model already in list.");return;}j=g.merge(h,{index:this._findIndex(i),model:i});h.silent?this._defAddFn(j):this.fire(c,j);return i;},_attachList:function(h){h.lists.push(this);h.addTarget(this);},_clear:function(){d.each(this._items,this._detachList,this);this._clientIdMap={};this._idMap={};this._items=[];},_detachList:function(i){var h=d.indexOf(i.lists,this);if(h>-1){i.lists.splice(h,1);i.removeTarget(this);}},_findIndex:function(l){var i=this.comparator,j=this._items,h=j.length-1,m=0,n,k,o;if(!i||!j.length){return j.length;}o=i(l);while(m<h){k=(m+h)/2;n=j[k];if(n&&i(n)<o){m=k+1;}else{h=k;}}return m;},_remove:function(j,i){var h=this.indexOf(j),k;i||(i={});if(h===-1){g.error("Model not in list.");return;}k=g.merge(i,{index:h,model:j});i.silent?this._defRemoveFn(k):this.fire(a,k);return j;},_afterIdChange:function(h){h.prevVal&&delete this._idMap[h.prevVal];h.newVal&&(this._idMap[h.newVal]=h.target);},_defAddFn:function(i){var h=i.model,j=h.get("id");this._clientIdMap[h.get("clientId")]=h;if(j){this._idMap[j]=h;}this._attachList(h);this._items.splice(i.index,0,h);},_defRefreshFn:function(h){if(h.src==="sort"){this._items=h.models.concat();return;}this._clear();if(h.models.length){this.add(h.models,{silent:true});}},_defRemoveFn:function(i){var h=i.model,j=h.get("id");this._detachList(h);delete this._clientIdMap[h.get("clientId")];if(j){delete this._idMap[j];}this._items.splice(i.index,1);}},{NAME:"modelList"});g.augment(b,g.ArrayList);g.ArrayList.addMethod(b.prototype,["get","getAsHTML","getAsURL"]);},"@VERSION@",{requires:["array-extras","array-invoke","arraylist","base-build","json-parse","model"]});YUI.add("view",function(b){function a(){a.superclass.constructor.apply(this,arguments);}b.View=b.extend(a,b.Base,{container:"<div/>",events:{},template:"",initializer:function(c){c||(c={});this.container=this.create(c.container||this.container);c.model&&(this.model=c.model);c.template&&(this.template=c.template);this.events=c.events?b.merge(this.events,c.events):this.events;this.attachEvents(this.events);},destructor:function(){this.container&&this.container.remove(true);},attachEvents:function(g){var d=this.container,i=b.Object.owns,h,e,f,c;
for(c in g){if(!i(g,c)){continue;}e=g[c];for(f in e){if(!i(e,f)){continue;}h=e[f];if(typeof h==="string"){h=this[h];}d.delegate(f,h,c,this);}}},create:function(c){return typeof c==="string"?b.Node.create(c):b.one(c);},remove:function(){this.container&&this.container.remove();return this;},render:function(){return this;}},{NAME:"view"});},"@VERSION@",{requires:["base-build","node-event-delegate"]});YUI.add("app",function(a){},"@VERSION@",{use:["controller","model","model-list","view"]});