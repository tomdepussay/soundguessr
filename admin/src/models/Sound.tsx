interface Sound {
    id: number;
    title: string;
    url?: string;
    path?: string;
    order: number;
    isActive: boolean;
    before?: number;
    after?: number;
    licenseId?: number;
    typeId?: number;

    license?: string;
    type?: string;
}

export default Sound;