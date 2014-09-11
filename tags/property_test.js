var property = require("./property"),
	option = require("./option"),
	process = require("../lib/process/doc"),
	assert = require("assert");


	
describe("documentjs/tags/property",function(){
	
	it("basic add",function(){
		
		var obj = {};
		var docMap = {Foo: {name: "Foo", type: "constructor"}}
		property.add.call(obj,"@property {Object} bar a description",null,docMap.Foo, docMap );
		
		assert.deepEqual(obj,{
			name: "bar",
			type: "property",
			types: [{type: "Object", options: []}],
			title: "a description",
		})
		
	});
	
	it("multiple types with options", function(){
		
		var obj = {};
		var docMap = {Foo: {name: "Foo", type: "constructor"}}
		property.add.call(obj,"@property {can.Map|Object|function} bar a description",null,docMap.Foo, docMap );
		option.add.call(obj,"@option {can.Map} can.Map description");
		option.add.call(obj,"@option {Object} Object description");
		option.add.call(obj,"@option {function(String)} Function description");
		
		
		assert.deepEqual(obj,{
			name: "bar",
			type: "property",
			types: [
				{type: "can.Map", description: "can.Map description"},
				{type: "Object", description: "Object description", options: []},
				{
					constructs: undefined,
					context: undefined,
					type: "function", 
					params: [
						{types: [{type: "String"}]}
					],
					returns: {types: [{type: "undefined"}]},
					description: "Function description"
				}
			],
			title: "a description",
		})
		
		
	})
	
	it("codeMatch", function(){
		assert.ok(property.codeMatch("foo = 'bar'"));
		assert.ok(property.codeMatch("foo: 'bar'"));
		assert.ok(!property.codeMatch("foo: function(){}"))
	});
	
	it("options on property", function(){
		var obj = {};
		var docMap = {Foo: {name: "Foo", type: "constructor"}}
		property.add.call(obj,"@property {{}} bar a description",null,docMap.Foo, docMap );
		option.add.call(obj,"@option {String} thing thing's description")
		
		assert.deepEqual(obj,{
			name: "bar",
			type: "property",
			types: [{
				type: "Object",
				options: [
					{name: "thing", types: [{type: "String"}], description: "thing's description"}
				]
			}],
			title: "a description"
		});
	});
	
	it("options code and scope", function(){
		
		var docMap = {Foo: {name: "Foo", type: "constructor"}};
		
		var obj = property.code("bar = {}", docMap.Foo, docMap)
		
		property.add.call(obj,"@property",null,docMap.Foo, docMap );
		
		assert.equal(obj.name, "Foo.bar")
		
	});
	
	it("process", function(){
		process.tags.property = property;
		
		
		var docMap = {Foo: {name: "Foo", type: "constructor"}};
		
		process.codeAndComment({
			code: "foo: 2",
			comment: ["@property","this is my comment"],
			docMap: docMap,
			scope: docMap.Foo
		}, function(newDoc, newScope){
			assert.equal(newScope, docMap.Foo, "scope is foo correctly");
			assert.equal(newDoc.name,"Foo.foo")
		})
	});
	
});