import { Equals, IsNotEmpty } from "class-validator";

class CreateUserDto {
    @IsNotEmpty()
    userAccount: string;

    @IsNotEmpty()
    userEmail: string;

    @IsNotEmpty()
    userPassword: string;

    @IsNotEmpty()
    checkUserPassword: string
}


class LoginUserDto {
    userAccount: string
    userPassword: string
}



export { CreateUserDto, LoginUserDto }