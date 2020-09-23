#! /usr/bin/env node
const fs = require("fs");
var program = require("commander");

const Jsx = (name, css) =>(
`import dom, { useState, Components } from 'dom';
${css?"import './"+css+".scss'":''}
function ${name}() {
  return (
    <div class='${name}'>{this.children}</div>
  )
}

export default Components(${name})
`);

const Scss = name => `.${name} {}`;

// function creatRouter(Name, path, page) {
//   const name = page || Name.toLocaleLowerCase();
//   return `
//   {
//     path: "/${name}",
//     name: "${name}",
//     component: () => import(/* webpackChunkName: "${name}"*/ "..${path}/${Name}")
//   }`;
// }

// function addRouter(newR, oldR) {
//   return oldR.replace(/\}\n\]/, "}," + newR + "\n]");
// }

function creatMkdir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function writeTm(path, vueTemp) {
  if (!fs.existsSync(path)) {
    fs.writeFile(path, vueTemp, "utf8", () => {
      console.log("created file in ", path);
    });
  } else {
    console.log(path, " is existence");
  }
}

function creatVue(path, name, vueTemp) {
  path = path + "/" + name + ".jsx";
  writeTm(path, vueTemp);
}

// const routerD = "./src/router/index.js";

program
  .version("0.1.0")
  .command("cp [name]")
  .description("run cp index --in /views --page padgname --script --style ")
  .option("-t, --to [path]", "creat where")
  .option("-j, --script ", "creat <script>")
  .option("-c, --style ", "creat <style>")
  .action(function(name, { to, script, style, page, vue }) {
    // return console.log( to, { name, script, style, page } )
    if (name === undefined) {
      console.log("cp index --in /views --page padgname --script --style ");
      return;
    }
    if (name instanceof Function) {
      console.log("need -n");
      return;
    }
    const paths = to.split("/").slice(1);
    let root = "./src";
    // console.log( 'creating Page' )

    paths.map(v => {
      root += "/" + v;
      creatMkdir(root);
    });

    const Name = (name.charAt(0).toUpperCase() + name.slice(1));
    const fname = name === 'index'? 'index' : Name
    writeTm(root+ "/" + fname + ".jsx", Jsx(fname==='index'?paths[paths.length - 1]:Name ,style?fname:null));
    style?writeTm(root+ "/" + fname + ".scss", Scss(fname==='index'?paths[paths.length - 1]:Name)):'';
    // creatVue(root, vue || Name, getVue(Name, script, style));
  });

program.parse(process.argv);
