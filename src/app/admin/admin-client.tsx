"use client";

import { useState } from "react";
import Link from "next/link";
import {
  getAdminLaunchAreasWithTiles,
  reorderLaunchAreas,
  reorderTiles,
  createTile,
  updateTile,
  deleteTile,
  updateAdminPassword,
} from "./actions";

type Area = Awaited<ReturnType<typeof getAdminLaunchAreasWithTiles>>[number];
type Tile = Area["tiles"][number];

function IconEye({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function IconPencil({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function IconGrip({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

function IconBack({ className }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M19 12H5" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

export function AdminClient({
  initialAreas,
}: {
  initialAreas: Awaited<ReturnType<typeof getAdminLaunchAreasWithTiles>>;
}) {
  const [areas, setAreas] = useState(initialAreas);
  const [expandedAreaId, setExpandedAreaId] = useState<string | null>(null);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [addingTileAreaId, setAddingTileAreaId] = useState<string | null>(null);
  const [newTileTitle, setNewTileTitle] = useState("");
  const [newTileUrl, setNewTileUrl] = useState("");
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [nextAdminPassword, setNextAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const refresh = async () => {
    const next = await getAdminLaunchAreasWithTiles();
    setAreas(next);
  };

  const handleMoveArea = async (index: number, direction: "up" | "down") => {
    const newOrder = [...areas];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[index], newOrder[swap]] = [newOrder[swap], newOrder[index]];
    setAreas(newOrder);
    await reorderLaunchAreas(newOrder.map((a) => a.id));
  };

  const handleMoveTile = async (areaId: string, index: number, direction: "up" | "down") => {
    const area = areas.find((a) => a.id === areaId);
    if (!area || area.tiles.length === 0) return;
    const tiles = [...area.tiles];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= tiles.length) return;
    [tiles[index], tiles[swap]] = [tiles[swap], tiles[index]];
    setAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, tiles } : a
      )
    );
    await reorderTiles(areaId, tiles.map((t) => t.id));
  };

  const handleTileDragStart = (e: React.DragEvent, areaId: string, tileIndex: number) => {
    setDraggedTileId(areas.find((a) => a.id === areaId)?.tiles[tileIndex]?.id ?? null);
    e.dataTransfer.setData("application/json", JSON.stringify({ areaId, fromIndex: tileIndex }));
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", ""); // required for Firefox
  };

  const handleTileDragOver = (e: React.DragEvent, tileIndex: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedTileId) setDropTargetIndex(tileIndex);
  };

  const handleTileDragLeave = () => {
    setDropTargetIndex(null);
  };

  const handleTileDrop = async (e: React.DragEvent, areaId: string, toIndex: number) => {
    e.preventDefault();
    setDropTargetIndex(null);
    setDraggedTileId(null);
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { areaId: srcAreaId, fromIndex } = data as { areaId: string; fromIndex: number };
      if (srcAreaId !== areaId) return;
      const area = areas.find((a) => a.id === areaId);
      if (!area || fromIndex === toIndex) return;
      const tiles = [...area.tiles];
      const [removed] = tiles.splice(fromIndex, 1);
      tiles.splice(toIndex, 0, removed);
      setAreas((prev) =>
        prev.map((a) => (a.id === areaId ? { ...a, tiles } : a))
      );
      await reorderTiles(areaId, tiles.map((t) => t.id));
    } catch {
      // ignore invalid drag data
    }
  };

  const handleTileDragEnd = () => {
    setDraggedTileId(null);
    setDropTargetIndex(null);
  };

  const handleAddTile = async (areaId: string) => {
    if (!newTileTitle.trim() || !newTileUrl.trim()) return;
    await createTile(areaId, { title: newTileTitle.trim(), url: newTileUrl.trim() });
    setNewTileTitle("");
    setNewTileUrl("");
    setAddingTileAreaId(null);
    await refresh();
  };

  const handleUpdateTile = async (tile: Tile, updates: { title?: string; url?: string; is_visible?: boolean }) => {
    await updateTile(tile.id, updates);
    setEditingTileId(null);
    await refresh();
  };

  const handleDeleteTile = async (tileId: string) => {
    if (!confirm("Remove this tile?")) return;
    await deleteTile(tileId);
    await refresh();
  };

  const handleUpdateAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    setPasswordSaving(true);
    try {
      await updateAdminPassword(currentAdminPassword, nextAdminPassword, confirmAdminPassword);
      setCurrentAdminPassword("");
      setNextAdminPassword("");
      setConfirmAdminPassword("");
      setPasswordMessage({ type: "success", text: "Admin password updated." });
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update password.",
      });
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Launch Areas & Tiles</h1>
        <Link
          href="/"
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          aria-label="Back to dashboard"
        >
          <IconBack />
        </Link>
      </header>

      <p className="text-slate-600 text-sm mb-6">
        Reorder launch areas and tiles. Add, edit, hide, or remove tiles per area.
      </p>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Update Admin Password</h2>
        <p className="text-slate-600 text-sm mb-4">
          Change the password used to unlock the Admin page.
        </p>
        <form onSubmit={handleUpdateAdminPassword} className="grid gap-3">
          <input
            type="password"
            placeholder="Current password"
            value={currentAdminPassword}
            onChange={(e) => setCurrentAdminPassword(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-900"
            autoComplete="current-password"
            required
          />
          <input
            type="password"
            placeholder="New password (min 8 chars)"
            value={nextAdminPassword}
            onChange={(e) => setNextAdminPassword(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-900"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmAdminPassword}
            onChange={(e) => setConfirmAdminPassword(e.target.value)}
            className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-900"
            autoComplete="new-password"
            minLength={8}
            required
          />
          {passwordMessage ? (
            <p className={`text-sm ${passwordMessage.type === "error" ? "text-red-600" : "text-emerald-600"}`}>
              {passwordMessage.text}
            </p>
          ) : null}
          <div>
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-4 py-2 rounded bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>

      <ul className="space-y-4">
        {areas.map((area, areaIndex) => (
          <li
            key={area.id}
            className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm"
          >
            <div className="flex items-center gap-2 p-3">
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => handleMoveArea(areaIndex, "up")}
                  disabled={areaIndex === 0}
                  className="text-slate-500 hover:text-slate-800 disabled:opacity-30 p-0.5"
                  aria-label="Move area up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveArea(areaIndex, "down")}
                  disabled={areaIndex === areas.length - 1}
                  className="text-slate-500 hover:text-slate-800 disabled:opacity-30 p-0.5"
                  aria-label="Move area down"
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  setExpandedAreaId(expandedAreaId === area.id ? null : area.id)
                }
                className="flex-1 text-left font-medium"
              >
                {area.slug === "reading"
                  ? "Reading and Spelling"
                  : area.slug === "english-grammar"
                    ? "English Grammar and Sentence Writing"
                    : area.title}
              </button>
              <span className="text-slate-500 text-sm">
                {area.tiles.length} tile{area.tiles.length !== 1 ? "s" : ""}
              </span>
            </div>

            {expandedAreaId === area.id && (
              <div className="border-t border-slate-200 p-3 space-y-2">
                {area.tiles.map((tile: Tile, tileIndex: number) => (
                  <div
                    key={tile.id}
                    onDragOver={(e) => handleTileDragOver(e, tileIndex)}
                    onDragLeave={handleTileDragLeave}
                    onDrop={(e) => handleTileDrop(e, area.id, tileIndex)}
                    onDragEnd={handleTileDragEnd}
                    data-tile-index={tileIndex}
                    className={`flex items-center gap-2 rounded bg-slate-50 border p-2 transition-colors ${
                      draggedTileId === tile.id ? "opacity-50" : dropTargetIndex === tileIndex ? "border-blue-400 bg-blue-50/50" : "border-slate-100"
                    }`}
                  >
                    <div
                      draggable
                      onDragStart={(e) => handleTileDragStart(e, area.id, tileIndex)}
                      onDragEnd={handleTileDragEnd}
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
                      title="Drag to reorder"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconGrip />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveTile(area.id, tileIndex, "up")}
                        disabled={tileIndex === 0}
                        className="text-slate-500 hover:text-slate-800 disabled:opacity-30 p-0.5 text-xs"
                        aria-label="Move up"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTile(area.id, tileIndex, "down")}
                        disabled={tileIndex === area.tiles.length - 1}
                        className="text-slate-500 hover:text-slate-800 disabled:opacity-30 p-0.5 text-xs"
                        aria-label="Move down"
                      >
                        ▼
                      </button>
                    </div>
                    {editingTileId === tile.id ? (
                      <TileEditForm
                        tile={tile}
                        onSave={(updates) => handleUpdateTile(tile, updates)}
                        onCancel={() => setEditingTileId(null)}
                      />
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{tile.title}</p>
                          <p className="text-slate-500 text-sm truncate">{tile.url}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateTile(tile, {
                                is_visible: !tile.is_visible,
                              })
                            }
                            className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title={tile.is_visible ? "Hide" : "Show"}
                            aria-label={tile.is_visible ? "Hide" : "Show"}
                          >
                            {tile.is_visible ? (
                              <IconEye className="text-emerald-600" />
                            ) : (
                              <IconEyeOff className="text-amber-600" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTileId(tile.id)}
                            className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                            title="Edit"
                            aria-label="Edit"
                          >
                            <IconPencil />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTile(tile.id)}
                            className="p-1.5 rounded text-slate-500 hover:text-red-600 hover:bg-red-50"
                            title="Remove"
                            aria-label="Remove"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {addingTileAreaId === area.id ? (
                  <div className="flex flex-col gap-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newTileTitle}
                      onChange={(e) => setNewTileTitle(e.target.value)}
                      className="px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={newTileUrl}
                      onChange={(e) => setNewTileUrl(e.target.value)}
                      className="px-2 py-1.5 rounded bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAddTile(area.id)}
                        className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddingTileAreaId(null);
                          setNewTileTitle("");
                          setNewTileUrl("");
                        }}
                        className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-sm hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAddingTileAreaId(area.id)}
                    className="w-full py-2 rounded border border-dashed border-slate-300 text-slate-500 hover:text-slate-800 hover:border-slate-400 hover:bg-slate-50 text-sm"
                  >
                    + Add tile
                  </button>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TileEditForm({
  tile,
  onSave,
  onCancel,
}: {
  tile: Tile;
  onSave: (updates: { title?: string; url?: string; is_visible?: boolean }) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(tile.title);
  const [url, setUrl] = useState(tile.url);

  return (
    <div className="flex-1 flex flex-wrap items-center gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 min-w-[120px] px-2 py-1 rounded bg-white border border-slate-200 text-slate-900"
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 min-w-[160px] px-2 py-1 rounded bg-white border border-slate-200 text-slate-900"
      />
      <button
        type="button"
        onClick={() => onSave({ title, url })}
        className="px-2 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
      >
        Save
      </button>
      <button type="button" onClick={onCancel} className="px-2 py-1 text-sm text-slate-600 hover:text-slate-800">
        Cancel
      </button>
    </div>
  );
}
