import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Classification extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@Column({ type: "varchar", name: "name", length: 50 })
	name!: string;

	@Column({ type: "text", name: "image", nullable: true })
	image!: string | null;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@UpdateDateColumn({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;

}
