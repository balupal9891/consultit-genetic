import { Expose,Exclude, Transform } from "class-transformer";

export class UserProfileDto {
  @Expose()
  _id!: string;

  @Expose()
  name!: string;

  @Expose()
  phone!: string;

  @Expose()
  email!: string;

  @Expose()
  gender!: 'male' | 'female' | 'other';

  @Expose()
  @Transform(({ obj }) => obj.blood_group ?? null)
  blood_group!: string | null;

  @Expose()
  @Transform(({ obj }) => obj.height_cm ?? null)
  height_cm!: number | null;

  @Expose()
  @Transform(({ obj }) => obj.weight_kg ?? null)
  weight_kg!: number | null;

  @Expose()
  @Transform(({ obj }) => obj.chronic_conditions ?? [])
  chronic_conditions!: string[];

  @Expose()
  @Transform(({ obj }) => obj.allergies ?? [])
  allergies!: string[];

  @Expose()
  @Transform(({ obj }) => obj.medications ?? [])
  medications!: string[];

  @Expose()
  @Transform(({ obj }) => obj.smoking ?? null)
  smoking!: boolean | null;

  @Expose()
  @Transform(({ obj }) => obj.alcohol ?? null)
  alcohol!: boolean | null;

  @Expose()
  @Transform(({ obj }) => obj.exercise_frequency ?? null)
  exercise_frequency!: string | null;

  @Expose()
  @Transform(({ obj }) => obj.diet_type ?? null)
  diet_type!: string | null;

  @Expose()
  @Transform(({ obj }) => obj.family_history ?? null)
  family_history!: string[] | null;

  @Expose()
  @Transform(({ obj }) => obj.location ?? null)
  location!: string | null;

  @Expose()
  @Transform(({ obj }) => obj.language ?? null)
  language!: string | null;

  @Expose()
  @Transform(({ obj }) => obj.emergency_contact ?? null)
  emergency_contact!: string | null;

  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  dob!: string;

  @Expose()
  get age(): number {
    if (!this.dob) return null as any;
    const [day, month, year] = this.dob.split("-").map(Number);
    const birthDate = new Date(year!, month! - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

//   @Expose()
//   createdAt!: Date;

//   @Expose()
//   updatedAt!: Date;
}
