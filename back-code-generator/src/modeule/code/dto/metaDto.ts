
export interface MetaDto {
    name: string;
    description: string;
    versin: string;
    author: string;
    createTime: string;
    fileConfig: FileConfig
    modelConfig: ModelConfig
}

interface FileConfig {
    inputRootPath?: string;
    fileName?: string;
    outputRootPath?: string
    sourceRootPath?: string
    type?: string
    files: (GroupFiles | Files)[]
}

interface Files {
    inputPath: string;
    outputPath: string;
    type: string;
    generatorType: string;
}

interface GroupFiles {
    groupKey: string;
    groupName: string;
    type: string;
    condition: string;
    files: Files[]
}

interface ModelConfig {
    models: (Models | GroupModel)[]
}

interface Models {
    fieldName: string;
    type: string;
    description: string;
    defaultValue: string
    abbr: string
}

interface GroupModel {
    groupKey: string;
    groupName: string;
    type: string;
    description: string;
    defaultValue: string;
    abbr: string;
    condition: string;
    model: Models[]
}