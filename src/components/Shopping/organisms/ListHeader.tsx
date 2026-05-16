"use client"
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { AddRounded, AssignmentRounded, EditRounded, EventNoteRounded, ExpandMoreRounded } from "@mui/icons-material";
import { useRef, useState } from "react";
import { PillButton } from "@/components/Shopping/atoms/PillButton";
import { ListSwitcherModal } from "@/components/Shopping/dialogs/ListSwitcherModal";
import { SavedList } from "@/components/Shopping/types";
import { STUB_SAVED_LISTS } from "@/components/Shopping/stubs";

interface ListHeaderProps {
  isLoggedIn: boolean;
  listName: string;
  setListName: (name: string) => void;
}

export function ListHeader({ isLoggedIn, listName, setListName }: ListHeaderProps) {
  const [editing, setEditing]       = useState(false);
  const [switcherOpen, setSwitcher] = useState(false);
  const [currentListId, setListId]  = useState('l1');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentList = STUB_SAVED_LISTS.find(l => l.id === currentListId) ?? STUB_SAVED_LISTS[0];

  const startEdit = () => {
    if (!isLoggedIn) return;
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 20);
  };

  const handleSelect = (list: SavedList) => {
    setListId(list.id);
    setListName(list.name);
  };

  return (
    <>
      <Box sx={{ px: 2, pt: 1.75, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        {/* List name row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
          <AssignmentRounded sx={{ color: 'primary.main', fontSize: 20, flexShrink: 0 }} />

          {editing ? (
            <InputBase
              inputRef={inputRef}
              value={listName}
              onChange={e => setListName(e.target.value)}
              onBlur={() => setEditing(false)}
              onKeyDown={e => e.key === 'Enter' && setEditing(false)}
              sx={{
                flex: 1,
                fontSize: '1.125rem',
                fontWeight: 500,
                '& input': {
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  pb: 0.125,
                },
              }}
            />
          ) : (
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                fontSize: '1.125rem',
                cursor: isLoggedIn ? 'text' : 'default',
                lineHeight: 1.2,
              }}
              onClick={startEdit}
            >
              {listName}
            </Typography>
          )}

          {isLoggedIn && !editing && (
            <IconButton size="small" onClick={startEdit} sx={{ color: 'text.secondary', width: 30, height: 30 }}>
              <EditRounded sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>

        {/* List switcher row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PillButton
            onClick={() => isLoggedIn && setSwitcher(true)}
            startIcon={<EventNoteRounded sx={{ fontSize: 14, color: 'text.secondary' }} />}
            endIcon={<ExpandMoreRounded sx={{ fontSize: 15, color: 'text.secondary' }} />}
            disabled={!isLoggedIn}
          >
            {currentList.shortName}
          </PillButton>

          {isLoggedIn && (
            <Box
              component="button"
              onClick={() => setSwitcher(true)}
              sx={{
                ml: 'auto',
                color: 'primary.main',
                fontSize: '0.8125rem',
                fontWeight: 500,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.25,
                px: 1,
                py: 0.625,
                borderRadius: 1,
                fontFamily: 'inherit',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: 'rgba(124,179,66,0.12)' },
              }}
            >
              <AddRounded sx={{ fontSize: 16 }} />
              Nueva lista
            </Box>
          )}
        </Box>
      </Box>

      {switcherOpen && (
        <ListSwitcherModal
          currentId={currentListId}
          onSelect={handleSelect}
          onClose={() => setSwitcher(false)}
        />
      )}
    </>
  );
}
