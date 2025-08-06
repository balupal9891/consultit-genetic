import { Expose, Exclude } from "class-transformer";

export class UserDto {

    @Expose()
    _id!: string;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    gender!: string;

    @Exclude({ toPlainOnly: true })
    @Expose({ toClassOnly: true })
    dob!: string;

    @Expose()
    get age(): number {
        if (!this.dob) return null as any;

        // Split and rearrange '14-10-2003' → [14, 10, 2003]
        const [day, month, year] = this.dob.split('-').map(Number);
        const birthDate = new Date(year!, month! - 1, day); // JS months are 0-based

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

}
