import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game";
import { Genre } from "./genre";

@Entity()
export class GameGenre extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@ManyToOne(() => Game, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_game" })
	game!: Game | null;

	@ManyToOne(() => Genre, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_genre" })
	genre!: Genre | null;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
