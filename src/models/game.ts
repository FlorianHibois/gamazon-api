import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import { Classification } from "./classification";

@Entity()
export class Game extends BaseEntity
{
	@PrimaryGeneratedColumn({ type: 'int', unsigned: true })
	id!: number;

	@ManyToOne(() => Classification, { cascade: true, nullable: true, eager: true })
	@JoinColumn({ name: "id_classification" })
	classification!: Classification | null;

	@OneToOne(() => Game, { cascade: true, nullable: true })
	@JoinColumn({ name: "id_prequel" })
	gamePrequel!: Game | null;

	@OneToOne(() => Game, { cascade: true, nullable: true })
	@JoinColumn({ name: "id_sequel" })
	gameSequel!: Game | null;

	@Column({ type: "varchar", name: "name", length: 100 })
	name!: string;

	@Column({ type: "datetime", name: "release_date", nullable: true })
	releaseDate!: Date;

	@Column({ type: "text", name: "image", nullable: true })
	image!: string | null;

	@CreateDateColumn({ type: "datetime", name: "creation_date" })
	creationDate!: Date;

	@Column({ type: "datetime", name: "modification_date", nullable: true })
	modificationDate!: Date | null;

	@Column({ type: "boolean", name: "active", default: true })
	active!: boolean;
}
