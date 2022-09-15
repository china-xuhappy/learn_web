import { getLocalMenu, saveLocalMenu } from "../utils";
import { getMenu } from "@/api";
import { MenuResponse } from "@/types"
let currentJob: Promise<MenuResponse> | null
export function getMenus() {
  if (currentJob) {
    return currentJob
  }
  const job: Promise<MenuResponse> = new Promise((reslove) => {
    let localMenu = getLocalMenu();
    console.log(localMenu, "localMenulocalMenulocalMenulocalMenu")
    if (localMenu) {
      return reslove(localMenu);
    }
    getMenu()
      .then((result) => {
        console.log(result, "resultresultresultresultresultresultresultresult")
        saveLocalMenu(result);
        reslove(result);
      })
      .catch((err) => {
        reslove([]);
      });
  });
  currentJob = job
  job.finally(() => { currentJob = null })
  return job
}
