import { readFile, writeFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import standaloneCode from "ajv/dist/standalone/index.js";
import { compile } from "json-schema-to-typescript";

const schema = JSON.parse(await readFile(new URL("../schemas/board.json", import.meta.url), "utf8"));
const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: true, code: { source: true, esm: true }, inlineRefs: false });
addFormats(ajv);
const validate = ajv.compile(schema);
await writeFile(new URL("../src/board-validator.js", import.meta.url), "import equalModule from 'ajv/dist/runtime/equal.js'; const equal = typeof equalModule === 'function' ? equalModule : equalModule.default;\n" + standaloneCode(ajv, validate).replaceAll('require("ajv/dist/runtime/equal").default', 'equal'));
await writeFile(new URL("../src/board-types.d.ts", import.meta.url), await compile(schema, "DbtChartsBoard", { bannerComment: "/* Generated from schemas/board.json. Do not edit. */", additionalProperties: false }));
