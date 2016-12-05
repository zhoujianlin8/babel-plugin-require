
module.exports =  function (t) {
	t = t.types || {}
  return {
    visitor: {
      CallExpression(path, state) {
        var node = path.node;
        var args = node.arguments || [];
        if (node.callee.name === "require" && args.length === 1 && t.isStringLiteral(args[0])) {
          var src = args[0].value;
          if(state.opts && typeof state.opts === 'function'){
          		var val = state.opts(src,path,state,t);
          		if(val !== src){
          			args[0].value = val;
          		}
          }
        }
      }
    }
  };
}