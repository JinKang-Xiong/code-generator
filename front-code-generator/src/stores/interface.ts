export interface UserLoginDto {
    _id: string;
    userAccount: string;
    userName: string;
    userAvatar: string;
    userProfile: string;
    userEmail: string;
    userPhone: string;
    userRole: number;
    userStatus: number;
    userCodeHobby: string[];
    isDelete: number;
    createTime: string;
    updateTime: string;
}