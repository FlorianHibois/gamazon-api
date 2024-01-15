import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Company extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@Index({ unique: true })
	@Column({ type: "varchar", name: "name", length: 50 })
	name!: string;

	@CreateDateColumn({ type: "datetime", name: "company_creation_date", nullable: true })
	companyCreationDate!: Date;

	@Column({ type: "text", name: "image", nullable: true })
	image!: string | null;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
