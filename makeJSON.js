exports.make = function(modules) {
    var totalModules = {
        modules: []
    };
    
    for (m in modules) {
    	var modulesName, description, core,
        methods = [],
        x, m;
        if (modules[m].length > 0) {
            //遍历模块
            for (x in modules[m]) {
                core = modules[m][x];
                if (core["$module"]) {
                    modulesName = core["$name"];
                    description = core["$description"];
                } else if (core["$method"]) {
                	methods.push({
                        method: core["$name"],
                        description: core["$description"],
                        example: core["$example"],
                        params: core["$params"],
                        returns: core["$returns"]
                    })
                }
            }
            totalModules["modules"].push({
                module: modulesName,
                description: description,
                methods: methods
            });
        }
    }
    return totalModules;
}

/*
totalModules = {
    modules: [{
        module: 'name',
        description: 'description',
        methods: [{
            method: 'name',
            description: 'description',
            example: 'example',
            params: [],
            returns: [obj]
        }]
    }]
}
*/
