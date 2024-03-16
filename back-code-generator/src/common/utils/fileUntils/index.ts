
import { readdirSync, statSync } from "fs";
import * as path from "path";

/**
 * 在文件夹中找寻特定的文件
 * @param folderPath 
 */
export async function SearchFile(folderPath: string, level: number, targetFile: string) {

    let targetPath: any;

    if (level == 0) {
        return
    }
    try {
        const files = readdirSync(folderPath)
        for (let file of files) {
            const filePath = path.join(folderPath, file)
            const stats = statSync(filePath)
            if (stats.isFile() && file === targetFile) {
                targetPath = filePath
                break
            }

            if (stats.isDirectory()) {
                targetPath = SearchFile(filePath, level - 1, targetFile)
            }
        }
    } catch (error) {
        console.log(error)
    }

    return targetPath

}