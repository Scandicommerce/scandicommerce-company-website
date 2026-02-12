"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { Box, Button, Card, Flex, Spinner, Stack, Text } from "@sanity/ui";
import { TrashIcon } from "@sanity/icons";

const GROQ_ALL = `*[_type == $schemaType] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, pageTitle, name, _id)
}`;

const GROQ_BY_LANGUAGE = `*[_type == $schemaType && (language == $language || (!defined(language) && $isDefault))] | order(_updatedAt desc) {
  _id,
  _type,
  "title": coalesce(title, pageTitle, name, _id)
}`;

type DocItem = { _id: string; _type: string; title: string };

type PageListWithDeleteProps = {
  id: string;
  itemId: string;
  paneKey: string;
  options?: { schemaType?: string; title?: string; language?: string };
  urlParams?: Record<string, string | undefined>;
};

const DEFAULT_LANGUAGE_ID = "en";

export function PageListWithDelete(props: PageListWithDeleteProps) {
  const { options } = props;
  const schemaType = (options?.schemaType as string) || "";
  const language = options?.language as string | undefined;
  const listTitle = (options?.title as string) || schemaType || "Documents";
  const client = useClient({ apiVersion: "2024-01-01" });
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchDocs = useCallback(() => {
    if (!schemaType) {
      setDocs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const useLanguageFilter = Boolean(language);
    const groq = useLanguageFilter ? GROQ_BY_LANGUAGE : GROQ_ALL;
    const params = useLanguageFilter
      ? { schemaType, language, isDefault: language === DEFAULT_LANGUAGE_ID }
      : { schemaType };
    client
      .fetch<DocItem[]>(groq, params)
      .then((list) => setDocs(Array.isArray(list) ? list : []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false));
  }, [client, schemaType, language]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleDelete = useCallback(
    (e: React.MouseEvent, docId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (!window.confirm("Are you sure you want to delete this document? This cannot be undone.")) {
        return;
      }
      setDeletingId(docId);
      client
        .delete(docId)
        .then(() => fetchDocs())
        .finally(() => setDeletingId(null));
    },
    [client, fetchDocs]
  );

  if (!schemaType) {
    return (
      <Card padding={4} tone="critical">
        <Text>Missing schema type. Check structure config.</Text>
      </Card>
    );
  }

  if (loading) {
    return (
      <Flex align="center" justify="center" padding={5}>
        <Spinner />
      </Flex>
    );
  }

  return (
    <Stack space={1} padding={2}>
      <Flex align="center" gap={2} paddingBottom={2} justify="space-between">
        <Text size={1} weight="semibold" muted>
          {listTitle}
        </Text>
        <IntentLink intent="create" params={{ type: schemaType }}>
          <Button text="Create new" tone="primary" mode="ghost" fontSize={1} />
        </IntentLink>
      </Flex>
      {docs.length === 0 ? (
        <Card padding={4} radius={2} tone="transparent">
          <Text size={1} muted>
            No documents yet.
          </Text>
        </Card>
      ) : (
        docs.map((doc) => (
          <Card key={doc._id} padding={0} radius={2} shadow={1}>
            <Flex align="center" gap={2} padding={2}>
              <Box flex={1}>
                <IntentLink
                  intent="edit"
                  params={{ id: doc._id, type: schemaType }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Text size={1} weight="medium">
                    {doc.title || doc._id}
                  </Text>
                  <Text size={0} muted>
                    {schemaType}
                  </Text>
                </IntentLink>
              </Box>
              <Button
                icon={TrashIcon}
                mode="bleed"
                tone="critical"
                title="Delete"
                disabled={deletingId === doc._id}
                onClick={(e) => handleDelete(e, doc._id)}
                style={{ flexShrink: 0 }}
              />
            </Flex>
          </Card>
        ))
      )}
    </Stack>
  );
}
