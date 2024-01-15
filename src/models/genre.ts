import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Genre extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@Column({ type: "varchar", name: "name", length: 50 })
	name!: string;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
