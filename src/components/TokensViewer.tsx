import React, { useState, useMemo } from 'react';
import { useTheme } from "../context/ThemeContext";

interface ColorValue {
  modeName: string;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
}

interface Token {
  id: string;
  name: string;
  type: string;
  description: string;
  collection: string;
  colorValues: ColorValue[];
}

interface TokensViewerProps {
  tokens: Token[];
}

export const TokensViewer: React.FC<TokensViewerProps> = ({ tokens }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';

  // Get all unique modes from tokens
  const modes = useMemo(() => {
    const modeSet = new Set<string>();
    tokens.forEach(token => {
      token.colorValues?.forEach(cv => {
        modeSet.add(cv.modeName);
      });
    });
    return Array.from(modeSet).sort();
  }, [tokens]);

  // Get all unique collections
  const collections = useMemo(() => {
    const collectionSet = new Set<string>();
    tokens.forEach(token => {
      if (token.collection) {
        collectionSet.add(token.collection);
      }
    });
    return Array.from(collectionSet).sort();
  }, [tokens]);

  // Set default collection on first load
  React.useEffect(() => {
    if (!selectedCollection && collections.length > 0) {
      setSelectedCollection(collections[0]);
    }
  }, [collections, selectedCollection]);

  // Filter tokens by collection and search
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = token.name.toLowerCase().includes(searchLower) ||
                           token.description.toLowerCase().includes(searchLower) ||
                           token.colorValues?.some(cv => cv.hex.toLowerCase().includes(searchLower));
      const matchesCollection = !selectedCollection || token.collection === selectedCollection;
      return matchesSearch && matchesCollection;
    });
  }, [tokens, searchQuery, selectedCollection]);

  // Group tokens by their top-level category (first part of name before /)
  const groupedTokens = useMemo(() => {
    const groups: Record<string, Token[]> = {};

    filteredTokens.forEach(token => {
      const parts = token.name.split('/');
      const groupKey = parts[0] || 'Other';

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(token);
    });

    return Object.keys(groups)
      .sort()
      .reduce((acc, key) => {
        acc[key] = groups[key].sort((a, b) => a.name.localeCompare(b.name));
        return acc;
      }, {} as Record<string, Token[]>);
  }, [filteredTokens]);

  // Copy to clipboard helper with feedback
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1500);
  };

  return (
    <div style={{ padding: '0 40px' }}>
      {/* Filters */}
      <div style={{ marginBottom: '32px' }}>
        {/* Search */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: isDark ? "#ddd" : '#333', display: 'block', marginBottom: '8px' }}>
            Search tokens
          </label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '10px 12px',
              fontSize: '14px',
              border: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
              borderRadius: '6px',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Collection Tabs */}
        {collections.length > 0 && (
          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, color: isDark ? "#ddd" : '#333', display: 'block', marginBottom: '8px' }}>
              Collections
            </label>
            <div style={{ display: 'flex', gap: '8px', borderBottom: `2px solid ${isDark ? "#444" : "#e8e8e8"}`, flexWrap: 'wrap' }}>
              {collections.map(collection => (
                <button
                  key={collection}
                  onClick={() => setSelectedCollection(collection)}
                  style={{
                    padding: '8px 12px',
                    background: 'none',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: selectedCollection === collection ? 600 : 400,
                    color: selectedCollection === collection ? colors.accent : isDark ? "#999" : "#666",
                    cursor: 'pointer',
                    borderBottom: selectedCollection === collection ? `3px solid ${colors.accent}` : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {collection}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div style={{ marginBottom: '24px', color: isDark ? "#999" : "#666", fontSize: '14px' }}>
        Showing {filteredTokens.length} of {tokens.length} tokens across {modes.length} modes
      </div>

      {/* Token Groups */}
      <div style={{ marginBottom: '48px' }}>
        {Object.keys(groupedTokens).length > 0 ? (
          Object.entries(groupedTokens).map(([groupName, groupTokens]) => (
            <div key={groupName} style={{ marginBottom: '40px' }}>
              {/* Group Header */}
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 600,
                  color: isDark ? '#fff' : '#1c1c1e',
                  marginBottom: '16px',
                  marginTop: 0,
                }}
              >
                {groupName}
              </h3>

              {/* Table Container with horizontal scroll */}
              <div
                style={{
                  overflowX: 'auto',
                  border: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                  borderRadius: '8px',
                  marginBottom: '24px',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                    backgroundColor: isDark ? "#1c1c1e" : "#fff",
                  }}
                >
                  {/* Table Header */}
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${isDark ? '#444' : '#e0e0e0'}`, backgroundColor: isDark ? '#222' : '#f9f9f9' }}>
                      <th
                        style={{
                          padding: '12px',
                          textAlign: 'left',
                          fontWeight: 600,
                          color: isDark ? "#fff" : "#1c1c1e",
                          minWidth: '200px',
                          position: 'sticky',
                          left: 0,
                          backgroundColor: isDark ? "#222" : "#f9f9f9",
                          zIndex: 10,
                        }}
                      >
                        Token
                      </th>
                      {modes.map(mode => (
                        <th
                          key={mode}
                          style={{
                            padding: '12px',
                            textAlign: 'center',
                            fontWeight: 600,
                            color: isDark ? "#fff" : "#1c1c1e",
                            minWidth: '120px',
                            borderLeft: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {mode}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody>
                    {groupTokens.map((token, idx) => {
                      if (token.type !== 'COLOR') {
                        return null;
                      }

                      return (
                        <tr
                          key={token.id}
                          style={{
                            borderBottom: `1px solid ${isDark ? "#444" : "#e8e8e8"}`,
                            backgroundColor: idx % 2 === 0 ? (isDark ? "#1c1c1e" : "#fff") : (isDark ? "#222" : "#f9f9f9"),
                          }}
                        >
                          {/* Token Name Column */}
                          <td
                            style={{
                              padding: '12px',
                              fontWeight: 500,
                              color: isDark ? colors.accent : colors.accent,
                              position: 'sticky',
                              left: 0,
                              backgroundColor: idx % 2 === 0 ? (isDark ? "#1c1c1e" : "#fff") : (isDark ? "#222" : "#f9f9f9"),
                              zIndex: 5,
                            }}
                          >
                            <div style={{ marginBottom: '4px' }}>
                              <code style={{ fontSize: '12px', fontWeight: 600 }}>
                                {token.name.split('/').slice(1).join('/')}
                              </code>
                            </div>
                            {token.description && (
                              <div style={{ fontSize: '11px', color: isDark ? "#999" : "#999" }}>
                                {token.description}
                              </div>
                            )}
                          </td>

                          {/* Mode Columns */}
                          {modes.map(mode => {
                            const colorValue = token.colorValues?.find(cv => cv.modeName === mode);
                            const cellId = `${token.id}-${mode}`;
                            const isCopied = copiedId === cellId;

                            return (
                              <td
                                key={cellId}
                                style={{
                                  padding: '12px',
                                  textAlign: 'center',
                                  borderLeft: `1px solid ${isDark ? "#444" : "#e0e0e0"}`,
                                  position: 'relative',
                                }}
                              >
                                {colorValue ? (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      gap: '6px',
                                      position: 'relative',
                                    }}
                                  >
                                    {/* Color Swatch */}
                                    <div
                                      style={{
                                        width: '32px',
                                        height: '32px',
                                        backgroundColor: colorValue.hex,
                                        borderRadius: '4px',
                                        border: `1px solid ${isDark ? "#444" : "#ddd"}`,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        position: 'relative',
                                      }}
                                      onClick={() => copyToClipboard(colorValue.hex, cellId)}
                                      onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)';
                                      }}
                                      onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                                      }}
                                      title={`Click to copy ${colorValue.hex}`}
                                    />

                                    {/* Hex Value */}
                                    <code
                                      style={{
                                        fontSize: '10px',
                                        color: isDark ? "#999" : "#666",
                                        background: isDark ? "#222" : "#f5f5f5",
                                        padding: '2px 4px',
                                        borderRadius: '2px',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        transition: 'all 0.2s',
                                      }}
                                      onClick={() => copyToClipboard(colorValue.hex, cellId)}
                                      title="Click to copy"
                                    >
                                      {colorValue.hex}
                                    </code>

                                    {/* Copied Feedback */}
                                    {isCopied && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '-28px',
                                          left: '50%',
                                          transform: 'translateX(-50%)',
                                          background: colors.accent,
                                          color: '#fff',
                                          padding: '4px 8px',
                                          borderRadius: '4px',
                                          fontSize: '11px',
                                          fontWeight: 500,
                                          whiteSpace: 'nowrap',
                                          pointerEvents: 'none',
                                          animation: 'fadeInOut 1.5s ease-in-out',
                                          zIndex: 100,
                                        }}
                                      >
                                        Copied!
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <span style={{ color: '#ccc' }}>—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 0', color: isDark ? "#999" : "#999" }}>
            <p style={{ fontSize: '16px', margin: 0 }}>No tokens found</p>
            <p style={{ fontSize: '14px', margin: '8px 0 0 0' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* CSS for animation */}
      <style>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(-5px);
          }
          10% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(5px);
          }
        }
      `}</style>
    </div>
  );
};

export default TokensViewer;
