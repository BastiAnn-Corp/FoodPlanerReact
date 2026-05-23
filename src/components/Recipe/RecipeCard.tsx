import React from "react";
import {Box, Typography} from "@mui/material";
import {PeopleAltRounded} from "@mui/icons-material";
import {IRecipe} from "@/util/models";
import {FAMILY_ACCENTS, foodFamilies} from "@/util/constants";
import {envVars} from "@/util/config";

interface RecipeCardProps {
  recipe: IRecipe;
  isLatest?: boolean;
  showDate?: boolean;
}

function getFamilyData(familyId: string) {
  return foodFamilies.find(f => f.id === familyId) ?? {name: familyId, id: familyId, icon: '🍽️'};
}

function formatShortDate(d: Date) {
  return d.toLocaleDateString('es-ES', {day: 'numeric', month: 'short'});
}

export function RecipeCard({recipe, isLatest = false, showDate = false}: RecipeCardProps) {
  const family = getFamilyData(recipe.family);
  const accent = FAMILY_ACCENTS[recipe.family] ?? '#7cb342';
  const createdAt = recipe.createdAt?.toDate?.();

  return (
    <Box
      component="a"
      href={envVars.baseURL + `/recipes/${recipe.id}`}
      sx={{
        flexShrink: 0,
        width: 148,
        backgroundColor: '#272727',
        border: '1px solid rgba(255,255,255,.12)',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform .18s, border-color .18s, box-shadow .18s',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: 'rgba(124,179,66,.28)',
          boxShadow: '0 8px 24px rgba(0,0,0,.45)',
        },
        '&:active': {transform: 'scale(.97)'},
      }}
    >
      {/* Accent bar */}
      <Box sx={{height: 3, width: '100%', backgroundColor: accent}} />

      {/* Body */}
      <Box
        sx={{
          padding: '12px 10px 14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          flex: 1,
        }}
      >
        {/* "Última" badge on the newest card */}
        {isLatest && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 8,
              backgroundColor: accent,
              borderRadius: '8px',
              padding: '1px 7px',
              fontSize: 9,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '.5px',
              textTransform: 'uppercase',
              lineHeight: 1.4,
            }}
          >
            Última
          </Box>
        )}

        {/* Emoji avatar */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            backgroundColor: `${accent}20`,
            border: `1px solid ${accent}38`,
          }}
        >
          {family.icon}
        </Box>

        {/* Name */}
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: 'rgba(255,255,255,.87)',
            textAlign: 'center',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          {recipe.name}
        </Typography>

        {/* Family label */}
        <Typography
          sx={{
            fontSize: 11,
            color: 'rgba(255,255,255,.60)',
            textAlign: 'center',
          }}
        >
          {family.name}
        </Typography>

        {/* Portions + date */}
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: 'auto'}}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '10px',
              padding: '2px 8px',
              backgroundColor: `${accent}18`,
              border: `1px solid ${accent}30`,
            }}
          >
            <PeopleAltRounded sx={{fontSize: 11, color: accent}} />
            <Typography sx={{fontSize: 11, fontWeight: 500, color: accent}}>
              {recipe.portions} por.
            </Typography>
          </Box>

          {showDate && createdAt && (
            <Typography sx={{fontSize: 10, color: 'rgba(255,255,255,.38)', letterSpacing: '.3px'}}>
              {formatShortDate(createdAt)}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
