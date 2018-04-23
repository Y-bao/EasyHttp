const fs = require("fs");
const path = require("path");
const babel = require("rollup-plugin-babel");
const eslint = require("rollup-plugin-eslint");
const replace = require("rollup-plugin-replace");
const build = require("./build");
const version = process.env.VERSION || require("../package.json").version;

const fullPath = p => path.resolve(__dirname, "../", p);

const banner =
    "/*!\n" +
    "* easy-http-axios.js v" +
    version +
    "\n" +
    "* (c) 2018-" +
    new Date().getFullYear() +
    " PengYuan-Jiang\n" +
    "*/";

function genConfig(opts) {
    return {
        input: {
            input: fullPath("src/easy-http-axios.js"),
            plugins: [
                eslint({
                    include: [fullPath("src/") + "**/*.js"] // 需要检查的部分
                }),
                babel({
                    exclude: "node_modules/**"
                })
            ],
            external: ["axios"]
        },
        output: {
            file: opts.output,
            format: opts.format,
            banner,
            min: opts.min,
            name: "EasyHttpAxios",
            globals: {
                axios: "axios"
            }
        }
    };
}

const builds = [
    {
        output: fullPath("dist/easy-http-axios.js"),
        format: "umd"
    },
    {
        output: fullPath("dist/easy-http-axios.min.js"),
        format: "umd",
        min: true
    },
    {
        output: fullPath("dist/easy-http-axios.common.js"),
        format: "cjs"
    },
    {
        output: fullPath("dist/easy-http-axios.esm.js"),
        format: "es"
    }
].map(genConfig);

var distDir = fullPath("dist/");
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}
build(builds);
