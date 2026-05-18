"use client"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Card, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Timestamp } from "@firebase/firestore";
import { Base } from "@/components/Base";
import { AnonBanner } from "@/components/Shopping/molecules/AnonBanner";
import { ListHeader } from "@/components/Shopping/organisms/ListHeader";
import { RecipeSelector } from "@/components/Shopping/organisms/RecipeSelector";
import { ActionBar } from "@/components/Shopping/organisms/ActionBar";
import { AisleGroup } from "@/components/Shopping/organisms/AisleGroup";
import { EmptyState } from "@/components/Shopping/organisms/EmptyState";
import { CelebrationBanner } from "@/components/Shopping/organisms/CelebrationBanner";
import { ReadonlyHeader } from "@/components/Shopping/organisms/ReadonlyHeader";
import { ShareDialog } from "@/components/Shopping/dialogs/ShareDialog";
import { PageMode, SavedList, ShoppingRecipe, SortMode } from "@/components/Shopping/types";
import { useAuth } from "@/hooks/useAuth";
import { IRecipe } from "@/util/models";
import { IShoppingList, IShoppingListRecipe } from "@/util/models";
import { foodFamilies } from "@/util/constants";
import {
  buildAisles,
  buildKeepText,
  buildListPayload,
  getRecipeIngredientDetails,
  hydrateSavedList,
  recipeToShoppingListRecipe,
  toSavedLists,
} from "@/util/shoppingListUtils";
import {
  createList,
  getListById,
  getMostRecentList,
  getSharedList,
  getUserLists,
  saveList,
  shareList,
  updateChecked,
} from "@/lib/firebase/shoppingLists";
import { getRecipes } from "@/lib/firebase/recipes";

// ---------------------------------------------------------------------------
// Main page component (wrapped in Suspense below for useSearchParams)
// ---------------------------------------------------------------------------

function ShoppingPageContent() {
  const theme     = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  // ── Auth & route mode ──────────────────────────────────────────
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const shareToken   = searchParams?.get("token") ?? null;

  const pageMode: PageMode =
    shareToken ? "readonly" : user ? "owner" : "anonymous";

  // ── Recipe catalog (for autocomplete) ─────────────────────────
  const [recipeCache, setRecipeCache] = useState<IRecipe[]>([]);

  // ── List identity ──────────────────────────────────────────────
  const [listId, setListId]               = useState<string | undefined>(undefined);
  const [listCreatedAt, setListCreatedAt] = useState<Timestamp | undefined>(undefined);
  const [allLists, setAllLists]           = useState<SavedList[]>([]);
  const [currentShareToken, setCurrentShareToken] = useState<string | undefined>(undefined);
  const [shareUrl, setShareUrl]           = useState<string | undefined>(undefined);

  // ── Shared-view metadata (readonly mode only) ──────────────────
  const [sharedMeta, setSharedMeta] = useState<{ ownerName: string; ownerInitials: string } | null>(null);

  // ── Shopping state ─────────────────────────────────────────────
  const [listRecipes, setListRecipes] = useState<IShoppingListRecipe[]>([]);
  const [checkedIds, setCheckedIds]   = useState<Set<string>>(new Set());
  const [listName, setListName]       = useState("Mi lista de compras");

  // ── UI state ───────────────────────────────────────────────────
  const [isDirty, setIsDirty]       = useState(false);
  const [bannerOn, setBannerOn]     = useState(true);
  const [sortMode, setSortMode]     = useState<SortMode>("aisle");
  const [shareOpen, setShareOpen]   = useState(false);
  const [snackMsg, setSnackMsg]     = useState("");
  const snackTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived state ──────────────────────────────────────────────

  /** ShoppingRecipe[] for the RecipeSelector chip row (UI shape). */
  const selRecipes: ShoppingRecipe[] = useMemo(
    () =>
      listRecipes.map(r => ({
        id: r.recipeId,
        name: r.name,
        emoji: foodFamilies.find(f => f.id === r.family)?.icon ?? "🍽️",
        portions: r.portions,
        basePortions: r.basePortions,
      })),
    [listRecipes]
  );

  /** ShoppingRecipe[] for the Autocomplete options. */
  const availableRecipes: ShoppingRecipe[] = useMemo(
    () =>
      recipeCache.map(r => ({
        id: r.id!,
        name: r.name,
        emoji: foodFamilies.find(f => f.id === r.family)?.icon ?? "🍽️",
        portions: r.portions,
        basePortions: r.portions,
      })),
    [recipeCache]
  );

  /** Consolidated aisle grouping — replaces makeStubAisles(). */
  const aisles = useMemo(
    () => buildAisles(listRecipes, checkedIds, sortMode),
    [listRecipes, checkedIds, sortMode]
  );

  // ── Data loading effects ───────────────────────────────────────

  // Load recipe catalog once on mount (needed for autocomplete)
  useEffect(() => {
    getRecipes({}).then(recipes => setRecipeCache(recipes ?? []));
  }, []);

  // Load list state after auth resolves
  useEffect(() => {
    if (authLoading) return;

    if (pageMode === "readonly" && shareToken) {
      getSharedList(shareToken).then(view => {
        if (!view) return; // TODO: show "link expired" state
        const displayName = view.ownerDisplayName ?? "Usuario";
        const initials = displayName
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        setSharedMeta({ ownerName: displayName, ownerInitials: initials });
        setListName(view.name);
        const { listRecipes: lr } = hydrateSavedList(view);
        setListRecipes(lr);
        setCheckedIds(new Set()); // shared viewers always start unchecked
      });
      return;
    }

    if (pageMode === "owner" && user) {
      Promise.all([
        getMostRecentList(user.uid),
        getUserLists(user.uid),
      ]).then(([recent, lists]) => {
        setAllLists(toSavedLists(lists));
        if (!recent) return;
        setListId(recent.id);
        setListCreatedAt(recent.createdAt);
        setListName(recent.name);
        if (recent.shareToken) {
          setCurrentShareToken(recent.shareToken);
          setShareUrl(
            `https://bastiann-corp.github.io/FoodPlanerReact/shopping?token=${recent.shareToken}`
          );
        }
        const { listRecipes: lr, checkedIngredientIds } = hydrateSavedList(recent);
        setListRecipes(lr);
        setCheckedIds(checkedIngredientIds);
      }).catch(err => console.error("[Shopping] Failed to load lists:", err));
    }
    // pageMode === 'anonymous': stays empty, no-op
  }, [authLoading, user, pageMode, shareToken]);

  // ── Helpers ────────────────────────────────────────────────────

  const showSnack = useCallback((msg: string) => {
    if (snackTimer.current) clearTimeout(snackTimer.current);
    setSnackMsg(msg);
    snackTimer.current = setTimeout(() => setSnackMsg(""), 2200);
  }, []);

  // ── Recipe manipulation ────────────────────────────────────────

  const addRecipe = (shoppingRecipe: ShoppingRecipe) => {
    const fullRecipe = recipeCache.find(r => r.id === shoppingRecipe.id);
    if (!fullRecipe) return;
    const snapshot = recipeToShoppingListRecipe(fullRecipe, fullRecipe.portions);
    setListRecipes(prev => [...prev, snapshot]);
    setIsDirty(true);
  };

  const removeRecipe = (id: string) => {
    setListRecipes(prev => prev.filter(r => r.recipeId !== id));
    setIsDirty(true);
  };

  const changePortions = (id: string, delta: number) => {
    setListRecipes(prev =>
      prev.map(r =>
        r.recipeId === id ? { ...r, portions: Math.max(1, r.portions + delta) } : r
      )
    );
    setIsDirty(true);
  };

  const getIngredientDetails = useCallback(
    (recipeId: string) => {
      const recipe = listRecipes.find(r => r.recipeId === recipeId);
      if (!recipe) return [];
      return getRecipeIngredientDetails(recipe);
    },
    [listRecipes]
  );

  // ── Check-off ──────────────────────────────────────────────────

  const toggleIngredient = (ingredientId: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(ingredientId)) next.delete(ingredientId);
      else next.add(ingredientId);
      // Persist immediately (no debounce — check/uncheck should feel instant)
      if (pageMode === "owner" && listId) {
        updateChecked(listId, [...next]).catch(() => {});
      }
      // Readonly / anonymous: in-memory only (never written to Firestore)
      return next;
    });
  };

  // ── Save ───────────────────────────────────────────────────────

  const handleSave = async () => {
    if (pageMode !== "owner" || !user) return;
    const payload = buildListPayload(listName, user.uid, listRecipes, checkedIds, currentShareToken);
    const id = await saveList(payload, listId, listCreatedAt);
    if (!listId) {
      setListId(id);
      const lists = await getUserLists(user.uid);
      setAllLists(toSavedLists(lists));
    }
    setIsDirty(false);
    showSnack("Lista guardada");
  };

  // ── Clear list ─────────────────────────────────────────────────

  const handleClear = async () => {
    setListRecipes([]);
    setCheckedIds(new Set());
    if (pageMode === "owner" && listId && user) {
      const payload = buildListPayload(listName, user.uid, [], new Set(), currentShareToken);
      await saveList(payload, listId, listCreatedAt);
    }
    setIsDirty(false);
  };

  // ── Share ──────────────────────────────────────────────────────

  const handleShare = async () => {
    if (pageMode !== "owner" || !user || !listId) return;
    // Flush unsaved changes before generating the share link
    if (isDirty) await handleSave();
    const token = await shareList(
      {
        ownerUid: user.uid,
        name: listName,
        recipes: listRecipes,
        checkedIngredientIds: [...checkedIds],
        id: listId,
        shareToken: currentShareToken,
      } as IShoppingList,
      user.displayName ?? "Usuario"
    );
    setCurrentShareToken(token);
    const url = `https://bastiann-corp.github.io/FoodPlanerReact/shopping?token=${token}`;
    setShareUrl(url);
    setShareOpen(true);
  };

  // ── New list ───────────────────────────────────────────────────

  const handleNewList = async () => {
    if (!user) return;
    const newId = await createList(user.uid, "Mi nueva lista");
    setListId(newId);
    setListCreatedAt(undefined);
    setListName("Mi nueva lista");
    setListRecipes([]);
    setCheckedIds(new Set());
    setCurrentShareToken(undefined);
    setShareUrl(undefined);
    setIsDirty(false);
    const lists = await getUserLists(user.uid);
    setAllLists(toSavedLists(lists));
  };

  // ── Select list from switcher ──────────────────────────────────

  const handleSelectList = async (savedList: SavedList) => {
    const full = await getListById(savedList.id);
    if (!full) return;
    setListId(full.id);
    setListCreatedAt(full.createdAt);
    setListName(full.name);
    if (full.shareToken) {
      setCurrentShareToken(full.shareToken);
      setShareUrl(
        `https://bastiann-corp.github.io/FoodPlanerReact/shopping?token=${full.shareToken}`
      );
    } else {
      setCurrentShareToken(undefined);
      setShareUrl(undefined);
    }
    const { listRecipes: lr, checkedIngredientIds } = hydrateSavedList(full);
    setListRecipes(lr);
    setCheckedIds(checkedIngredientIds);
    setIsDirty(false);
  };

  // ── Copy for Google Keep ───────────────────────────────────────

  const handleCopy = () => {
    navigator.clipboard.writeText(buildKeepText(aisles)).catch(() => {});
    showSnack("Lista copiada al portapapeles");
  };

  // ── Computed flags ─────────────────────────────────────────────

  const allDone    = aisles.length > 0 && aisles.every(a => a.items.every(i => i.checked));
  const hasContent = listRecipes.length > 0;

  // ── Shared panels ──────────────────────────────────────────────

  const leftPanel =
    pageMode === "readonly" ? (
      <ReadonlyHeader
        ownerName={sharedMeta?.ownerName ?? ""}
        ownerInitials={sharedMeta?.ownerInitials ?? ""}
        listName={listName}
      />
    ) : (
      <>
        <ListHeader
          isLoggedIn={pageMode === "owner"}
          listName={listName}
          setListName={name => { setListName(name); setIsDirty(true); }}
          lists={allLists}
          currentListId={listId ?? ""}
          onSelectList={handleSelectList}
          onNewList={handleNewList}
        />
        <RecipeSelector
          availableRecipes={availableRecipes}
          selectedRecipes={selRecipes}
          onAdd={addRecipe}
          onRemove={removeRecipe}
          onPortionChange={changePortions}
          getIngredientDetails={getIngredientDetails}
        />
      </>
    );

  const actionBarProps = {
    sortMode,
    onSortChange: setSortMode,
    canShare: pageMode === "owner" && !!listId,
    onShare: handleShare,
    onCopy: handleCopy,
    canSave: isDirty && pageMode === "owner",
    onSave: handleSave,
  };

  const aisleList = (
    <Box pb={1}>
      {aisles.map(a => (
        <AisleGroup key={a.id} aisle={a} onToggle={toggleIngredient} />
      ))}
    </Box>
  );

  const dialogs = (
    <>
      {shareOpen && (
        <ShareDialog
          onClose={() => setShareOpen(false)}
          shareUrl={shareUrl}
        />
      )}
      <Snackbar
        open={!!snackMsg}
        message={snackMsg}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );

  // ── Desktop layout ─────────────────────────────────────────────
  if (isDesktop) {
    return (
      <Base>
        {pageMode === "anonymous" && bannerOn && (
          <AnonBanner onDismiss={() => setBannerOn(false)} />
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "clamp(280px, 28%, 360px) minmax(320px, 1fr)",
            gap: 3,
            alignItems: "start",
            pt: 3,
            pb: 8,
          }}
        >
          {/* Left: sticky selector card */}
          <Box sx={{ position: "sticky", top: "80px", alignSelf: "start" }}>
            <Card variant="outlined" sx={{ borderRadius: 2, overflow: "clip" }}>
              {leftPanel}
            </Card>
          </Box>

          {/* Right: ingredient list */}
          <Card variant="outlined" sx={{ borderRadius: 2, overflow: "clip", minWidth: 320 }}>
            {!hasContent ? (
              <EmptyState />
            ) : (
              <>
                <ActionBar {...actionBarProps} sticky={false} />
                {allDone && <CelebrationBanner />}
                {aisleList}
              </>
            )}
          </Card>
        </Box>

        {dialogs}
      </Base>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────
  return (
    <Base>
      {pageMode === "anonymous" && bannerOn && (
        <AnonBanner onDismiss={() => setBannerOn(false)} />
      )}
      {leftPanel}
      {!hasContent ? (
        <EmptyState />
      ) : (
        <>
          <ActionBar {...actionBarProps} sticky />
          {allDone && <CelebrationBanner />}
          {aisleList}
        </>
      )}
      {dialogs}
    </Base>
  );
}

// ---------------------------------------------------------------------------
// Export — Suspense wrapper required for useSearchParams in Next.js 15
// ---------------------------------------------------------------------------

export default function ShoppingPage() {
  return (
    <Suspense>
      <ShoppingPageContent />
    </Suspense>
  );
}
