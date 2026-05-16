"use client"
import { Box, Card, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import { useCallback, useRef, useState } from "react";
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
import { ShoppingAisle, ShoppingRecipe, SortMode } from "@/components/Shopping/types";
import { makeStubAisles } from "@/components/Shopping/stubs";

// TODO: replace hardcoded states with real auth + route params once data layer is ready
const USER_IS_LOGGED_IN = true;
const IS_READONLY       = false;

export default function ShoppingPage() {
  const theme     = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [bannerOn, setBannerOn]     = useState(!USER_IS_LOGGED_IN && !IS_READONLY);
  const [listName, setListName]     = useState('Mi Lista de Compras');
  const [sortMode, setSortMode]     = useState<SortMode>('aisle');
  const [shareOpen, setShareOpen]   = useState(false);
  const [snackMsg, setSnackMsg]     = useState('');
  const snackTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [selRecipes, setSelRecipes] = useState<ShoppingRecipe[]>([]);
  const [aisles, setAisles]         = useState<ShoppingAisle[]>([]);

  const showSnack = useCallback((msg: string) => {
    if (snackTimer.current) clearTimeout(snackTimer.current);
    setSnackMsg(msg);
    snackTimer.current = setTimeout(() => setSnackMsg(''), 2200);
  }, []);

  const addRecipe = (recipe: ShoppingRecipe) => {
    setSelRecipes(prev => {
      const next = [...prev, recipe];
      if (!prev.length) setAisles(makeStubAisles());
      return next;
    });
  };

  const removeRecipe = (id: string) => {
    setSelRecipes(prev => {
      const next = prev.filter(r => r.id !== id);
      if (!next.length) setAisles([]);
      return next;
    });
  };

  const changePortions = (id: string, delta: number) => {
    setSelRecipes(prev =>
      prev.map(r => r.id === id ? { ...r, portions: Math.max(1, r.portions + delta) } : r)
    );
  };

  const toggleIngredient = (ingredientId: string) => {
    setAisles(prev =>
      prev.map(a => ({
        ...a,
        items: a.items.map(i => i.id === ingredientId ? { ...i, checked: !i.checked } : i),
      }))
    );
  };

  const handleCopy = () => {
    const lines = aisles
      .flatMap(a => a.items)
      .map(i => `[ ] ${i.qty} ${i.name}`)
      .join('\n');
    navigator.clipboard.writeText(lines).catch(() => {});
    showSnack('Lista copiada al portapapeles');
  };

  const allDone    = aisles.length > 0 && aisles.every(a => a.items.every(i => i.checked));
  const hasContent = selRecipes.length > 0;

  const displayAisles: ShoppingAisle[] = sortMode === 'alpha'
    ? [{
        id: 'alpha',
        icon: '🔤',
        name: 'Todos los ingredientes',
        items: [...aisles.flatMap(a => a.items)].sort((x, y) =>
          x.name.localeCompare(y.name, 'es')
        ),
      }]
    : aisles;

  // ── Shared panels ──────────────────────────────────────────────
  const leftPanel = IS_READONLY
    ? <ReadonlyHeader ownerName="Andrea B." ownerInitials="AB" listName="Semana del 20 de mayo" />
    : (
        <>
          <ListHeader isLoggedIn={USER_IS_LOGGED_IN} listName={listName} setListName={setListName} />
          <RecipeSelector
            selectedRecipes={selRecipes}
            onAdd={addRecipe}
            onRemove={removeRecipe}
            onPortionChange={changePortions}
          />
        </>
      );

  const actionBarProps = {
    sortMode,
    onSortChange: setSortMode,
    canShare: USER_IS_LOGGED_IN && !IS_READONLY,
    onShare: () => setShareOpen(true),
    onCopy: handleCopy,
  };

  const aisleList = (
    <Box pb={1}>
      {displayAisles.map(a => (
        <AisleGroup key={a.id} aisle={a} onToggle={toggleIngredient} />
      ))}
    </Box>
  );

  const dialogs = (
    <>
      {shareOpen && <ShareDialog onClose={() => setShareOpen(false)} />}
      <Snackbar
        open={!!snackMsg}
        message={snackMsg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );

  // ── Desktop layout ──────────────────────────────────────────────
  if (isDesktop) {
    return (
      <Base>
        {!USER_IS_LOGGED_IN && !IS_READONLY && bannerOn && (
          <AnonBanner onDismiss={() => setBannerOn(false)} />
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'clamp(280px, 28%, 360px) minmax(320px, 1fr)',
            gap: 3,
            alignItems: 'start',
            pt: 3,
            pb: 8,
          }}
        >
          {/* Left: sticky selector card */}
          <Box sx={{ position: 'sticky', top: '80px', alignSelf: 'start' }}>
            <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'clip' }}>
              {leftPanel}
            </Card>
          </Box>

          {/* Right: ingredient list — ActionBar is static inside the card (not sticky) */}
          <Card variant="outlined" sx={{ borderRadius: 2, overflow: 'clip', minWidth: 320 }}>
            {!hasContent
              ? <EmptyState />
              : <>
                  <ActionBar {...actionBarProps} sticky={false} />
                  {allDone && <CelebrationBanner />}
                  {aisleList}
                </>
            }
          </Card>
        </Box>

        {dialogs}
      </Base>
    );
  }

  // ── Mobile layout ───────────────────────────────────────────────
  return (
    <Base>
      {!USER_IS_LOGGED_IN && !IS_READONLY && bannerOn && (
        <AnonBanner onDismiss={() => setBannerOn(false)} />
      )}
      {leftPanel}
      {!hasContent
        ? <EmptyState />
        : <>
            <ActionBar {...actionBarProps} sticky />
            {allDone && <CelebrationBanner />}
            {aisleList}
          </>
      }
      {dialogs}
    </Base>
  );
}
