import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import { Permission } from "./permission";

@Entity()
export class User extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@ManyToOne(() => Permission, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_permission" })
	permission!: Permission | null;

	@Index({ unique: true })
	@Column({ type: "varchar", name: "user_name", length: 50 })
	userName!: string;

	@Column({ type: "varchar", name: "password", length: 255 })
	password!: string;

	@Column({ type: "text", name: "image", nullable: true })
	image!: string | null;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
