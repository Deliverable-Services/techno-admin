import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Form,
  Badge,
  Button,
  ListGroup,
  InputGroup,
  Spinner,
} from "../ui/bootstrap-compat";
import { X, User, UserPlus } from "../../components/ui/icon";
import API from "../../utils/API";

interface Guest {
  id?: number;
  guest_id?: number;
  guest_type?: "user" | "lead" | "customer";
  guest_name?: string;
  guest_email: string;
  guest_phone?: string;
  display_text?: string;
  isExternal?: boolean;
}

interface SearchResult {
  id: number;
  name: string;
  email: string;
  phone?: string;
  type: "user" | "lead" | "customer";
  display_text: string;
}

interface GuestSelectorProps {
  guests: Guest[];
  onChange: (guests: Guest[]) => void;
  error?: string;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({
  guests,
  onChange,
  error,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [externalEmail, setExternalEmail] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    return (...args: any[]) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  // Search function
  const searchGuests = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await API.get("/meetings/search/guests", {
        params: { q: query },
      });

      if (response.data.success) {
        setSearchResults(response.data.data || []);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(debounce(searchGuests, 300), [debounce]);

  useEffect(() => {
    if (searchQuery) {
      debouncedSearch(searchQuery);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addGuest = (searchResult: SearchResult) => {
    // Check if guest is already added
    const isAlreadyAdded = guests.some(
      (guest) =>
        guest.guest_id === searchResult.id &&
        guest.guest_type === searchResult.type
    );

    if (isAlreadyAdded) {
      return;
    }

    const newGuest: Guest = {
      guest_id: searchResult.id,
      guest_type: searchResult.type,
      guest_name: searchResult.name,
      guest_email: searchResult.email,
      guest_phone: searchResult.phone,
      display_text: searchResult.display_text,
      isExternal: false,
    };

    onChange([...guests, newGuest]);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const addExternalGuest = () => {
    if (!externalEmail || !isValidEmail(externalEmail)) {
      return;
    }

    // Check if email is already added
    const isAlreadyAdded = guests.some(
      (guest) => guest.guest_email.toLowerCase() === externalEmail.toLowerCase()
    );

    if (isAlreadyAdded) {
      return;
    }

    const newGuest: Guest = {
      guest_email: externalEmail,
      display_text: externalEmail,
      isExternal: true,
    };

    onChange([...guests, newGuest]);
    setExternalEmail("");
  };

  const removeGuest = (index: number) => {
    const updatedGuests = guests.filter((_, i) => i !== index);
    onChange(updatedGuests);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleKeyPress = (e: React.KeyboardEvent, isExternal = false) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isExternal) {
        addExternalGuest();
      } else if (searchResults.length > 0) {
        addGuest(searchResults[0]);
      }
    }
  };

  return (
    <div className="guest-selector">
      <Form.Label>
        <User className="me-1" />
        Meeting Guests
      </Form.Label>

      {/* Search for existing users/leads */}
      <div className="position-relative mb-3">
        <InputGroup>
          <Form.Control
            ref={searchInputRef}
            type="text"
            placeholder="Search for users or leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
          />
          {isSearching && (
            <InputGroup.Text>
              <Spinner size="sm" animation="border" />
            </InputGroup.Text>
          )}
        </InputGroup>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div
            ref={dropdownRef}
            className="position-absolute w-100 mt-1 bg-white border rounded shadow-lg"
            style={{ zIndex: 1000, maxHeight: "200px", overflowY: "auto" }}
          >
            <ListGroup variant="flush">
              {searchResults.map((result) => (
                <ListGroup.Item
                  key={`${result.type}-${result.id}`}
                  action
                  onClick={() => addGuest(result)}
                  className="d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <User className="me-2 text-muted" />
                  <div>
                    <div className="fw-medium">{result.name}</div>
                    <small className="text-muted">{result.email}</small>
                    <Badge
                      bg={
                        result.type === "lead"
                          ? "warning"
                          : result.type === "customer"
                          ? "success"
                          : "primary"
                      }
                      className="ms-2"
                    >
                      {result.type}
                    </Badge>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </div>

      {/* Add external guest */}
      <div className="mb-3">
        <InputGroup>
          <Form.Control
            type="email"
            placeholder="Add external guest by email..."
            value={externalEmail}
            onChange={(e) => setExternalEmail(e.target.value)}
            onKeyPress={(e) => handleKeyPress(e, true)}
          />
          <Button
            variant="outline-secondary"
            onClick={addExternalGuest}
            disabled={!externalEmail || !isValidEmail(externalEmail)}
          >
            <UserPlus />
          </Button>
        </InputGroup>
      </div>

      {/* Selected Guests */}
      {guests.length > 0 && (
        <div>
          <div className="mb-2">
            <small className="text-muted">
              Selected Guests ({guests.length})
            </small>
          </div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            {guests.map((guest, index) => (
              <Badge
                key={index}
                bg={guest.isExternal ? "secondary" : "primary"}
                className="d-flex align-items-center gap-1 p-2"
              >
                <span>{guest.display_text || guest.guest_email}</span>
                <X
                  style={{ cursor: "pointer" }}
                  onClick={() => removeGuest(index)}
                  size={16}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Error display */}
      {error && <div className="text-danger small mt-1">{error}</div>}

      {/* Helper text */}
      <Form.Text className="text-muted">
        <User className="me-1" />
        Search for existing users and leads, or add external guests by email
      </Form.Text>
    </div>
  );
};

export default GuestSelector;
