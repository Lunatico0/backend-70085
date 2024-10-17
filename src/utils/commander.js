import { Command } from "commander";
const program = new Command();

program
  .option("-d, --debug", "output extra debugging")
  .option("-m, --mode <mode>", "Working mode", "dev")
  .option("-p, --port <port>", "set port number", 8080)

program.parse();

export default program;
