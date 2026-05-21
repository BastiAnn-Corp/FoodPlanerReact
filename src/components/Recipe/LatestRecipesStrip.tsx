"use client"
import React, {useEffect, useState} from "react";
import {Box, Skeleton, Typography} from "@mui/material";
import {IRecipe} from "@/util/models";
import {getLatestRecipes} from "@/lib/firebase/recipes";
import {RecipeCard} from "@/components/Recipe/RecipeCard";

interface LatestRecipesStripProps {
  /** Show creation date on each card. Default off until existing recipes have timestamps. */
  showDate?: boolean;
  /** How many recipes to fetch. Defaults to 7 to match the design. */
  count?: number;
}

export function LatestRecipesStrip({showDate = false, count = 7}: LatestRecipesStripProps) {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const data = await getLatestRecipes(count);
      if (!cancelled) {
        setRecipes(data);
        setIsLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [count]);

  // Hide the strip when there are no timestamped recipes yet — avoids a confusing empty block.
  if (!isLoading && recipes.length === 0) return null;

  return (
    <Box sx={{padding: '16px 16px 0'}}>
      {/* Section header */}
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px'}}>
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,.60)',
              textTransform: 'uppercase',
              letterSpacing: '1.1px',
              lineHeight: 1.4,
            }}
          >
            Últimas recetas
          </Typography>
          <Typography sx={{fontSize: 11, color: 'rgba(255,255,255,.38)', marginTop: '1px'}}>
            Creadas recientemente
          </Typography>
        </Box>
      </Box>

      {/* Horizontal strip */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          padding: '4px 2px 20px',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {display: 'none'},
        }}
      >
        {isLoading
          ? Array.from({length: count}).map((_, i) => (
              <Skeleton
                key={`skeleton-${i}`}
                variant="rounded"
                width={148}
                height={196}
                sx={{flexShrink: 0, borderRadius: '14px'}}
              />
            ))
          : recipes.map((recipe, idx) => (
              <RecipeCard
                key={recipe.id ?? `latest-${idx}`}
                recipe={recipe}
                isLatest={idx === 0}
                showDate={showDate}
              />
            ))}
      </Box>
    </Box>
  );
}
