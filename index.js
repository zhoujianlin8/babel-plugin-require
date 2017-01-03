/*import * as babylon from 'babylon';
 import traverse from 'babel-traverse';
 import * as types from 'babel-types';
 import generate from 'babel-generator';

 /!* eslint-disable new-cap *!/

 export default function traverseImport(options, inputSource) {
 let specified; // Collector import specifiers
 let hasPlatformSpecified = false;

 const platformMap = {
 weex: 'isWeex',
 web: 'isWeb',
 node: 'isNode',
 reactnative: 'isReactNative'
 };

 function variableDeclarationMethod(name, value) {
 return types.VariableDeclaration(
 'const', [
 types.variableDeclarator(
 types.Identifier(name),
 types.BooleanLiteral(value)
 )
 ]
 );
 }

 function objectExpressionMethod(platformName) {
 const properties = [];

 Object.keys(platformMap).forEach((p) => {
 properties.push(
 types.objectProperty(
 types.Identifier(platformMap[p]),
 types.booleanLiteral(p === platformName)
 )
 );
 });

 return types.objectExpression(properties);
 }

 let ast = babylon.parse(inputSource, {
 sourceType: 'module',
 plugins: [
 '*',
 ]
 });

 traverse(ast, {
 enter() {
 specified = new Array();

 if (typeof platformMap[options.platform] !== 'undefined') {
 hasPlatformSpecified = true;
 }
 },
 // Support commonjs method `require`
 CallExpression(path) {
 let { node } = path;

 if (
 hasPlatformSpecified &&
 node.callee.name === 'require' &&
 node.arguments[0] &&
 node.arguments[0].value === options.name
 ) {
 path.replaceWith(objectExpressionMethod(options.platform));
 }
 },
 ImportDeclaration(path) {
 let { node } = path;

 if (node.source.value === options.name) {
 node.specifiers.forEach(spec => {
 specified.push({
 local: spec.local.name,
 imported: spec.imported.name
 });
 });

 if (hasPlatformSpecified) {
 specified.forEach(specObj => {
 let newNodeInit = specObj.imported === platformMap[options.platform] ?
 true : false;
 let newNode = variableDeclarationMethod(
 specObj.imported,
 newNodeInit
 );

 path.insertAfter(newNode);

 // Support custom alise import:
 // import { isWeex as iw } from 'universal-env';
 // const isWeex = true;
 // const iw = true;
 if (specObj.imported !== specObj.local) {
 newNode = variableDeclarationMethod(
 specObj.local,
 newNodeInit
 );
 path.insertAfter(newNode);
 }
 });

 path.remove();
 }
 }
 }
 });

 return generate(ast, null, inputSource);
 };*/

module.exports = function (t) {
    t = t.types || {};
    let specified; // Collector import specifiers
    let hasPlatformSpecified = false;

    const platformMap = {
        weex: 'isWeex',
        web: 'isWeb',
        node: 'isNode',
        reactnative: 'isReactNative'
    };
    return {
        traverse: {
            CallExpression(path) {
                let { node } = path;

                if (
                    hasPlatformSpecified &&
                    node.callee.name === 'require' &&
                    node.arguments[0] &&
                    node.arguments[0].value === options.name
                ) {
                    path.replaceWith(objectExpressionMethod(options.platform));
                }
            },
            enter() {
                specified = new Array();

                if (typeof platformMap[options.platform] !== 'undefined') {
                    hasPlatformSpecified = true;
                }
            },
            ImportDeclaration(path) {
                let { node } = path;

                if (node.source.value === options.name) {
                    node.specifiers.forEach(spec => {
                        specified.push({
                        local: spec.local.name,
                        imported: spec.imported.name
                    });
                });

                    if (hasPlatformSpecified) {
                        specified.forEach(specObj => {
                            let newNodeInit = specObj.imported === platformMap[options.platform] ?
                                true : false;
                        let newNode = variableDeclarationMethod(
                            specObj.imported,
                            newNodeInit
                        );

                        path.insertAfter(newNode);

                        // Support custom alise import:
                        // import { isWeex as iw } from 'universal-env';
                        // const isWeex = true;
                        // const iw = true;
                        if (specObj.imported !== specObj.local) {
                            newNode = variableDeclarationMethod(
                                specObj.local,
                                newNodeInit
                            );
                            path.insertAfter(newNode);
                        }
                    });

                        path.remove();
                    }
                }
            }
        }
    };
}
