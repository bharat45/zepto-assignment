"use client";

// node_modules
import { useEffect, useState } from "react";
import Image from "next/image";

// logo
import zeptoLogo from "@/public/zepto-logo.svg";

// grocery icons
import apple from "@/public/apple.png";
import bananas from "@/public/bananas.png";
import instantNoodles from "@/public/instant-noodles.png";
import milk from "@/public/milk.png";
import tomato from "@/public/tomato.png";
import whiteBread from "@/public/white-bread.png";

// close icon
import closeIcon from "@/public/close.png";

// css
import styles from "./page.module.css";

type groceryItem = {
  icon: any;
  name: string;
  highLighted?: boolean;
};

const groceryItems: groceryItem[] = [
  {
    icon: apple,
    name: "apple",
  },
  {
    icon: bananas,
    name: "bananas",
  },
  {
    icon: instantNoodles,
    name: "instant noodles",
  },
  {
    icon: milk,
    name: "milk",
  },
  {
    icon: tomato,
    name: "tomato",
  },
  {
    icon: whiteBread,
    name: "white bread",
  },
];

export default function Home() {
  const [suggestions, setSuggestions] = useState<groceryItem[]>(groceryItems);
  const [selectedItems, setSelectedItems] = useState<groceryItem[]>([]);
  const [search, setSearch] = useState("");

  const handleChange = (e: any) => {
    setSearch(e.target.value);
    let suggestions = groceryItems;
    for (let item of selectedItems) {
      suggestions = suggestions.filter((s) => s.name !== item.name);
    }
    if (e.target.value === "") {
      setSuggestions(suggestions);
      return;
    }
    const items = suggestions.filter(
      (s) => !!s.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    );
    setSuggestions(items);
  };

  const addItem = (item: groceryItem) => {
    let items: groceryItem[] = selectedItems.map((i) => ({
      ...i,
      highLighted: false,
    }));
    items.push({
      ...item,
      highLighted: false
    });
    setSelectedItems(items);
    setSearch("");
  };

  const removeItem = (item: groceryItem) => {
    let items = selectedItems.filter((i) => i.name !== item.name);
    items = items.map((i) => ({
      ...i,
      highLighted: false,
    }));
    setSelectedItems(items);
  };

  useEffect(() => {
    let suggestions = groceryItems;
    for (let item of selectedItems) {
      suggestions = suggestions.filter((s) => s.name !== item.name);
    }
    setSuggestions(suggestions);
  }, [selectedItems]);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 8 && search === "") {
      const itemToBeRemoved = selectedItems[selectedItems.length - 1];
      if (itemToBeRemoved.highLighted) {
        const items = selectedItems.slice(0, selectedItems.length - 1);
        setSelectedItems(items);
      } else {
        itemToBeRemoved.highLighted = true;
        setSelectedItems((prev) => [
          ...prev.slice(0, selectedItems.length - 1),
          itemToBeRemoved,
        ]);
      }
    }
  };

  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);

  return (
    <div className={styles.main}>
      <Image
        src={zeptoLogo}
        alt="zepto-logo"
        width={200}
        height={200}
        className={styles.zeptoLogo}
      />
      <div className={styles.searchContainer}>
        {selectedItems.map((s, i) => (
          <div
            key={i + "_selected"}
            className={styles.selectedItem}
            style={{
              border:
                s.highLighted && i === selectedItems.length - 1
                  ? "1px solid #3c006b"
                  : "none",
            }}
          >
            <Image src={s.icon} height={15} width={15} alt={s.name} />
            <span>{s.name}</span>
            <Image
              src={closeIcon}
              height={10}
              width={10}
              alt="close"
              className={styles.closeIcon}
              onClick={() => removeItem(s)}
            />
          </div>
        ))}
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            placeholder="Search..."
            onChange={handleChange}
            value={search}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
          />
          {focused && (
            <div className={styles.suggestionsContainer}>
              {suggestions.map((s, i) => (
                <button
                  className={styles.suggestion}
                  key={i}
                  onClick={() => addItem(s)}
                >
                  <Image src={s.icon} height={20} width={20} alt={s.name} />
                  <span>{s.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
