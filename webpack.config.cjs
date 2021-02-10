module.exports = {	
	node: {
		fs: 'empty'
	},
	mode: "production",
	target: "async-node",
	output: {
		libraryTarget: "umd",
		library: "iconTransformer",
		libraryExport: "default"
	}
};
