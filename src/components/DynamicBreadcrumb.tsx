import React from "react";
import { Link } from "react-router-dom"; 
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
interface BreadcrumbItem {
  label: string | null;
  href?: string;
}

interface DynamicBreadcrumbProps {
  items: BreadcrumbItem[];
}

const DynamicBreadcrumb: React.FC<DynamicBreadcrumbProps> = ({ items }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {item.href ? (
                <Link to={item.href}>
                  <BreadcrumbLink>{item.label}</BreadcrumbLink>
                </Link>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
