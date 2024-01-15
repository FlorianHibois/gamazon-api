import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Permission extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@Column({ type: "varchar", name: "description", length: 50 })
	description!: string;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
