import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";
import { User } from "./user";

@Entity()
export class Rating extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@ManyToOne(() => Game, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_game" })
	game!: Game | null;

	@ManyToOne(() => User, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_user" })
	user!: User | null;

	@Column({ type: "decimal", name: "rate", precision: 4, scale: 2 })
	rate!: number;

	@Column({ type: "text", name: "message" })
	message!: string;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
