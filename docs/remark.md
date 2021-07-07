### 配置文件

默认为当前目录下的`agds.doc.config.js`，自动合并[默认配置](#defaultConfig)

可以通过命令行参数`-c --config <config>`或者node api的`options.config` 来指定配置文件名称

可以通过命令行参数`--no-default`或者node api的`options.default=false` 来禁止使用默认配置，默认配置相对比较通用，大部分情况不需要禁止，当默认配置和你的配置冲突时可以使用此选项

配置文件导出类型为[👉`RenderOptions`](#RenderOptions),理论上支持所有的renderOption，由默认模板提供的`helpers`配置请看[👉默认模板支持的helpers](#DefaultHelpers)、[👉默认模板](#defaultTemplate)

