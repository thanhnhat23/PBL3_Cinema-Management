import type { Key } from "react";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Chip,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    useDisclosure,
} from "@heroui/react";
import { CalendarIcon, EllipsisVertical, Eye, PenLine, Speech, Trash } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useActorStore, type Actor } from "@/stores/useActorStore";
import DataTableAdmin, { type AdminColumn } from "../../dataTable";
import { useTranslation } from "react-i18next";

const getActorColumns = (t: (key: string) => string): AdminColumn[] => [
    { name: "ID", uid: "actor_id", sortable: true },
    { name: t('actors_tab.columns.name'), uid: "name", sortable: true },
    { name: t('actors_tab.columns.gender'), uid: "gender", sortable: true },
    { name: t('actors_tab.columns.birthday'), uid: "birthday", sortable: true },
    { name: t('actors_tab.columns.birthplace'), uid: "place_of_birth", sortable: true },
    { name: t('common.actions'), uid: "actions" },
];

const genderColorMap: Record<string, "primary" | "success" | "default"> = {
    male: "primary",
    female: "success",
    other: "default",
};

const getAvatarSrc = (profilePath?: string | null) => {
    if (!profilePath) return "https://placehold.co/100x100?text=Actor";
    if (profilePath.startsWith("http://") || profilePath.startsWith("https://")) return profilePath;
    return `https://image.tmdb.org/t/p/original/${profilePath}`;
};

export default function LayoutActors() {
    const { t } = useTranslation();
    const {
        actors,
        movieWithActors,
        isFetchingActors,
        fetchAllActors,
        fetchActorById,
        fetchMovieWithActors,
        fetchCharacterWithActors,
        updateActor,
        isUpdatingActor,
    } = useActorStore();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const popoverContainerRef = useRef<HTMLDivElement | null>(null);
    const [editForm, setEditForm] = useState({
        name: "",
        gender: "2",
        profile_path: "",
        biography: "",
        birthday: "",
        place_of_birth: "",
    });

    const getGenderText = useCallback((gender?: number | null) => {
        if (gender === 2) return t('actors_tab.genders.male');
        if (gender === 1) return t('actors_tab.genders.female');
        return t('actors_tab.genders.other');
    }, [t]);

    const getGenderKey = useCallback((gender?: number | null) => {
        if (gender === 2) return "male";
        if (gender === 1) return "female";
        return "other";
    }, []);

    const parseLocalDate = (value?: string) => {
        if (!value) return undefined;

        const [year, month, day] = value.split("-").map(Number);
        if (!year || !month || !day) return undefined;

        const date = new Date(year, month - 1, day);
        return Number.isNaN(date.getTime()) ? undefined : date;
    };

    const toDateInputValue = (value?: Date | string | null) => {
        if (!value) return "";

        if (typeof value === "string") {
            const dateOnlyMatch = value.match(/^(\d{4}-\d{2}-\d{2})/);
            if (dateOnlyMatch) return dateOnlyMatch[1];
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return format(date, "yyyy-MM-dd");
    };

    const birthdayValue = parseLocalDate(editForm.birthday);

    const handleOpenAdd = useCallback(() => {
        setIsAdding(true);
        setSelectedActor(null);
        setEditForm({
            name: "",
            gender: "2",
            profile_path: "",
            biography: "",
            birthday: "",
            place_of_birth: "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleOpenEdit = useCallback((actor: Actor) => {
        setIsAdding(false);
        setSelectedActor(actor);
        setEditForm({
            name: actor.name ?? "",
            gender: String(actor.gender ?? 2),
            profile_path: actor.profile_path ?? "",
            biography: actor.biography ?? "",
            birthday: toDateInputValue(actor.birthday),
            place_of_birth: actor.place_of_birth ?? "",
        });
        onEditOpen();
    }, [onEditOpen]);

    const handleSaveActor = async () => {
        const payload = {
            name: editForm.name.trim(),
            gender: Number(editForm.gender),
            profile_path: editForm.profile_path.trim(),
            biography: editForm.biography.trim(),
            birthday: editForm.birthday || null,
            place_of_birth: editForm.place_of_birth.trim(),
        };

        if (isAdding) {
            const { createActor } = useActorStore.getState();
            await createActor(payload);
        } else if (selectedActor) {
            await updateActor(selectedActor.actor_id, payload);
        }

        onEditOpenChange();
    };

    useEffect(() => {
        fetchAllActors();
    }, [fetchAllActors]);

    const renderCell = useCallback((actor: Actor, columnKey: Key) => {
        const cellValue = actor[columnKey as keyof Actor];

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex items-center gap-3">
                        <div className="shrink-0 w-10 h-10 relative rounded-md overflow-hidden border border-zinc-100 dark:border-white/5 shadow-sm">
                            <Image
                                src={getAvatarSrc(actor.profile_path)}
                                alt={actor.name}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        </div>
                        <span className="text-sm font-bold truncate max-w-30 sm:max-w-50 md:max-w-none" title={actor.name}>
                            {actor.name}
                        </span>
                    </div>
                );
            case "gender": {
                const genderText = getGenderText(actor.gender);
                const genderKey = getGenderKey(actor.gender);
                return (
                    <Chip className="capitalize" color={genderColorMap[genderKey]} size="sm" variant="flat">
                        {genderText}
                    </Chip>
                );
            }
            case "birthday":
                return actor.birthday ? <span>{toDateInputValue(actor.birthday).split("-").reverse().join("/")}</span> : <span>N/A</span>;
            case "place_of_birth":
                return <span>{actor.place_of_birth ?? "N/A"}</span>;
            case "actions":
                return (
                    <Dropdown classNames={{
                        content: "bg-sidebar shadow-lg border-1 border-zinc-200 dark:border-zinc-800",
                    }}>
                        <DropdownTrigger>
                            <button className="p-2 rounded-sm hover:border-1 hover:border-zinc-200 dark:hover:border-zinc-800 hover:bg-sidebar cursor-pointer">
                                <EllipsisVertical size={18} />
                            </button>
                        </DropdownTrigger>

                        <DropdownMenu>
                            <DropdownItem
                                key="view"
                                startContent={<Eye size={18} />}
                                onPress={async () => {
                                    await fetchActorById(actor.actor_id);
                                    setSelectedActor(useActorStore.getState().selectedActor);
                                    await Promise.all([
                                        fetchMovieWithActors(actor.actor_id),
                                        fetchCharacterWithActors(actor.actor_id),
                                    ]);
                                    onOpen();
                                }}
                            >
                                {t('common.view')}
                            </DropdownItem>
                            <DropdownItem
                                key="edit"
                                startContent={<PenLine size={18} />}
                                showDivider
                                onPress={() => handleOpenEdit(actor)}
                            >
                                {t('common.edit')}
                            </DropdownItem>
                            <DropdownItem
                                key="delete"
                                startContent={<Trash size={18} />}
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                    const { deleteActor } = useActorStore.getState();
                                    deleteActor(actor.actor_id);
                                }}
                            >
                                {t('common.delete')}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return String(cellValue ?? "");
        }
    }, [fetchActorById, fetchCharacterWithActors, fetchMovieWithActors, handleOpenEdit, onOpen, t, getGenderText, getGenderKey]);

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-sm border border-zinc-100 dark:border-zinc-800 bg-sidebar p-8 shadow-sm">
                <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-20 pointer-events-none">
                    <Speech size={120} />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 w-fit rounded-full bg-zinc-100 dark:bg-zinc-800 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {t('common.management_system')}
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                            {t('actors_tab.title')}
                        </h1>
                        <p className="text-sm text-zinc-500 font-medium max-w-lg">
                            {t('actors_tab.desc')}
                        </p>
                    </div>
                </div>
            </div>

            <DataTableAdmin<Actor>
                columns={getActorColumns(t)}
                items={actors}
                isLoading={isFetchingActors}
                searchPlaceholder={t('actors_tab.search_placeholder')}
                addButtonLabel={t('actors_tab.add_actor')}
                onAdd={handleOpenAdd}
                totalLabel={(count) => t('actors_tab.total_count', { count })}
                emptyLabel={t('actors_tab.empty_label')}
                loadingLabel={t('actors_tab.loading_label')}
                defaultSort={{ column: "name", direction: "ascending" }}
                rowKey={(item) => item.actor_id}
                searchBy={(item) => item.name}
                renderCell={renderCell}
                filters={[
                    {
                        uid: "gender",
                        name: t('actors_tab.gender_label'),
                        options: [
                            { name: t('actors_tab.genders.male'), uid: "2" },
                            { name: t('actors_tab.genders.female'), uid: "1" },
                            { name: t('actors_tab.genders.other'), uid: "0" },
                        ]
                    }
                ]}
            />

            <Drawer isOpen={isOpen} onOpenChange={onOpenChange} size="md" classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {selectedActor ? t('movie_details.view_details', { title: selectedActor.name }) : t('actors_tab.details_title')}
                            </DrawerHeader>

                            <DrawerBody className="px-0">
                                {selectedActor ? (
                                    <div className="flex flex-col gap-0">
                                        <div className="relative w-full h-80 bg-zinc-900 flex justify-center overflow-hidden">
                                            {/* Blurred background */}
                                            <div className="absolute inset-0 opacity-40 blur-2xl scale-110">
                                                <Image
                                                    src={getAvatarSrc(selectedActor.profile_path)}
                                                    alt=""
                                                    fill
                                                    sizes="100vw"
                                                    className="object-cover"
                                                />
                                            </div>

                                            <div className="relative mt-8 w-48 h-64 shadow-2xl rounded-lg overflow-hidden border-2 border-white/10 z-10">
                                                <Image
                                                    src={getAvatarSrc(selectedActor.profile_path)}
                                                    alt={selectedActor.name}
                                                    fill
                                                    sizes="192px"
                                                    priority
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-sidebar to-transparent z-10" />
                                        </div>

                                        <div className="px-6 -mt-10 relative z-20 flex flex-col gap-6 pb-8">
                                            <div className="flex flex-col gap-2">
                                                <h2 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">{selectedActor.name}</h2>
                                                <div className="flex gap-2 flex-wrap">
                                                    <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border-none px-2.5 py-0.5 text-[10px] font-bold">ID: {selectedActor.actor_id}</Badge>
                                                    <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px] font-bold uppercase">{getGenderText(selectedActor.gender)}</Badge>
                                                    {selectedActor.birthday && (
                                                        <Badge variant="outline" className="px-2.5 py-0.5 text-[10px] font-medium border-zinc-200 dark:border-zinc-800">
                                                            {new Date(String(selectedActor.birthday)).toLocaleDateString(t('locale_code'))}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('actors_tab.birthplace_label')}</span>
                                                    <span className="text-sm font-semibold">{selectedActor.place_of_birth ?? "Unknown"}</span>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('actors_tab.bio_label')}</span>
                                                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
                                                        {selectedActor.biography || t('actors_tab.no_bio')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{t('actors_tab.movies_participated')}</span>
                                                    <Badge variant="outline" className="text-[10px] font-normal">{movieWithActors.length} films</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {movieWithActors.length > 0 ? (
                                                        movieWithActors.map((item) => (
                                                            <div key={item.Movie?.movie_id} className="px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shadow-sm text-xs font-medium">
                                                                {item.Movie?.title}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-zinc-500">{t('actors_tab.no_movies')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-12 text-center text-zinc-500 font-medium">{t('actors_tab.empty_label')}</div>
                                )}
                            </DrawerBody>
                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button onClick={onClose} className="w-full font-bold border border-zinc-200 dark:border-zinc-800 rounded-lg py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                                    {t('foods_tab.close_details')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <Drawer isOpen={isEditOpen} onOpenChange={onEditOpenChange} classNames={{ base: "bg-sidebar" }}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1 border-b border-zinc-100 dark:border-zinc-800">
                                {isAdding ? t('actors_tab.add_new_actor') : t('actors_tab.edit_actor')}
                            </DrawerHeader>
                            <DrawerBody>
                                <p className="text-sm text-zinc-500 mb-4 py-4">{isAdding ? t('actors_tab.add_actor_subtitle') : t('actors_tab.edit_actor_subtitle')}</p>

                                <div ref={popoverContainerRef} className="grid gap-4 py-2">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            {t('actors_tab.name_label')}
                                        </Label>
                                        <Input
                                            id="name"
                                            value={editForm.name}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))}
                                            className="col-span-3 bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="profile_path" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            {t('actors_tab.profile_label')}
                                        </Label>
                                        <Input
                                            id="profile_path"
                                            value={editForm.profile_path}
                                            placeholder="/path/to/profile.jpg"
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, profile_path: event.target.value }))}
                                            className="col-span-3 bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="birthday" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            {t('actors_tab.birthday_label')}
                                        </Label>

                                        <div className="col-span-3">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        data-empty={!birthdayValue}
                                                        className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground bg-sidebar h-12 rounded-lg"
                                                    >
                                                        <CalendarIcon />
                                                        {birthdayValue ? format(birthdayValue, "PPP") : <span>{t('actors_tab.select_date')}</span>}
                                                    </Button>
                                                </PopoverTrigger>

                                                <PopoverContent container={popoverContainerRef.current} className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={birthdayValue}
                                                        onSelect={(selectedDate) => {
                                                            setEditForm((prev) => ({
                                                                ...prev,
                                                                birthday: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
                                                            }));
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="place_of_birth" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                            {t('actors_tab.birthplace_label')}
                                        </Label>

                                        <Input
                                            id="place_of_birth"
                                            value={editForm.place_of_birth}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, place_of_birth: event.target.value }))}
                                            className="col-span-3 bg-sidebar h-12 rounded-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="biography" className="text-xs font-bold uppercase tracking-wider text-zinc-500 pt-2">
                                            {t('actors_tab.bio_label')}
                                        </Label>

                                        <Textarea
                                            id="biography"
                                            value={editForm.biography}
                                            placeholder={t('actors_tab.bio_placeholder')}
                                            onChange={(event) => setEditForm((prev) => ({ ...prev, biography: event.target.value }))}
                                            className="col-span-3 text-sm min-h-30 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </DrawerBody>

                            <DrawerFooter className="border-t border-zinc-100 dark:border-zinc-800">
                                <button
                                    type="button"
                                    onClick={handleSaveActor}
                                    disabled={isUpdatingActor}
                                    className="w-full h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-zinc-200 dark:shadow-none disabled:opacity-50 cursor-pointer"
                                >
                                    {isUpdatingActor ? t('actors_tab.saving') : t('actors_tab.save_changes')}
                                </button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    )
}
