import { useState } from 'react';
import {
  Library,
  Lightbulb,
  Square,
  GraduationCap,
  FileText,
  Layout,
  Atom,
  GitBranch,
  Calculator,
  BookOpen,
  Brain,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '../ui/dropdown-menu';

interface TemplateLibraryButtonProps {
  templateId?: string;
  onInsertComponent: (componentType: string, data?: any) => void;
}

/**
 * Template-specific component library button
 * Shows relevant quick-add components based on the template type
 */
export function TemplateLibraryButton({
  templateId,
  onInsertComponent,
}: TemplateLibraryButtonProps) {
  const [open, setOpen] = useState(false);

  // Get template-specific configuration
  const getTemplateConfig = () => {
    switch (templateId) {
      case 'template-math':
        return {
          icon: Library,
          label: 'Math Library',
          color: 'text-blue-600',
          items: [
            { label: 'Equation Box', value: 'equation-box', symbol: '∑' },
            { label: 'Formula', value: 'formula', symbol: '∫' },
            { label: 'Grid Paper', value: 'grid', symbol: '⊞' },
            { type: 'separator' },
            { label: 'Equations', value: 'equations-header', isHeader: true },
            { label: 'Linear (2x + 4y = 10)', value: 'equation-linear1', symbol: '2x + 4y = 10' },
            { label: 'Linear (4x - 3y = 10)', value: 'equation-linear2', symbol: '4x - 3y = 10' },
            { label: 'Quadratic (x² + 5x + 6 = 0)', value: 'equation-quad1', symbol: 'x² + 5x + 6 = 0' },
            { label: 'Quadratic (ax² + bx + c = 0)', value: 'equation-quad2', symbol: 'ax² + bx + c = 0' },
            { label: 'Slope-Intercept (y = mx + b)', value: 'equation-slope', symbol: 'y = mx + b' },
            { label: 'Pythagorean (a² + b² = c²)', value: 'equation-pythag', symbol: 'a² + b² = c²' },
            { type: 'separator' },
            { label: 'Common Symbols', value: 'symbols-header', isHeader: true },
            { label: 'Sum (∑)', value: 'symbol-sum', symbol: '∑' },
            { label: 'Integral (∫)', value: 'symbol-integral', symbol: '∫' },
            { label: 'Square Root (√)', value: 'symbol-sqrt', symbol: '√' },
            { label: 'Pi (π)', value: 'symbol-pi', symbol: 'π' },
            { label: 'Infinity (∞)', value: 'symbol-infinity', symbol: '∞' },
            { label: 'Plus-Minus (±)', value: 'symbol-plusminus', symbol: '±' },
            { label: 'Approximately (≈)', value: 'symbol-approx', symbol: '≈' },
            { label: 'Not Equal (≠)', value: 'symbol-notequal', symbol: '≠' },
            { label: 'Less/Equal (≤)', value: 'symbol-lte', symbol: '≤' },
            { label: 'Greater/Equal (≥)', value: 'symbol-gte', symbol: '≥' },
          ],
        };

      case 'template-brainstorm':
        return {
          icon: Lightbulb,
          label: 'Mind Map Tools',
          color: 'text-yellow-600',
          items: [
            { label: 'Add Branch Node', value: 'branch-node', symbol: '○' },
            { label: 'Add Sub-Node', value: 'sub-node', symbol: '●' },
            { label: 'Connect Nodes', value: 'connector', symbol: '→' },
            { type: 'separator' },
            { label: 'Color Coding', value: 'color-header', isHeader: true },
            { label: 'Important (Red)', value: 'node-red', color: 'red' },
            { label: 'Action (Green)', value: 'node-green', color: 'green' },
            { label: 'Idea (Yellow)', value: 'node-yellow', color: 'yellow' },
            { label: 'Info (Blue)', value: 'node-blue', color: 'blue' },
          ],
        };

      case 'template-kanban':
        return {
          icon: Square,
          label: 'Kanban Tools',
          color: 'text-green-600',
          items: [
            { label: 'Add Task Card', value: 'task-card', symbol: '⬜' },
            { label: 'Add Column', value: 'column', symbol: '▭' },
            { label: 'Add Swimlane', value: 'swimlane', symbol: '▬' },
            { type: 'separator' },
            { label: 'Priority Labels', value: 'priority-header', isHeader: true },
            { label: 'High Priority', value: 'priority-high', color: 'red' },
            { label: 'Medium Priority', value: 'priority-medium', color: 'yellow' },
            { label: 'Low Priority', value: 'priority-low', color: 'green' },
          ],
        };

      case 'template-teaching':
        return {
          icon: GraduationCap,
          label: 'Teaching Tools',
          color: 'text-purple-600',
          items: [
            { label: 'Add Section', value: 'section', symbol: '□' },
            { label: 'Add Example Box', value: 'example', symbol: 'e.g.' },
            { label: 'Add Quiz Question', value: 'quiz', symbol: '?' },
            { label: 'Add Diagram Area', value: 'diagram', symbol: '⊞' },
            { type: 'separator' },
            { label: 'Annotations', value: 'annotation-header', isHeader: true },
            { label: 'Key Point', value: 'keypoint', symbol: '★' },
            { label: 'Important Note', value: 'important', symbol: '!' },
            { label: 'Remember', value: 'remember', symbol: '💡' },
          ],
        };

      case 'template-meeting':
        return {
          icon: FileText,
          label: 'Meeting Tools',
          color: 'text-indigo-600',
          items: [
            { label: 'Add Agenda Item', value: 'agenda-item', symbol: '•' },
            { label: 'Add Action Item', value: 'action-item', symbol: '☐' },
            { label: 'Add Decision', value: 'decision', symbol: '✓' },
            { label: 'Add Note Section', value: 'note-section', symbol: '📝' },
            { type: 'separator' },
            { label: 'Quick Templates', value: 'quick-header', isHeader: true },
            { label: 'Attendee List', value: 'attendees', symbol: '👥' },
            { label: 'Time Slot', value: 'timeslot', symbol: '⏰' },
            { label: 'Follow-up', value: 'followup', symbol: '📅' },
          ],
        };

      case 'template-wireframe':
        return {
          icon: Layout,
          label: 'UI Components',
          color: 'text-slate-600',
          items: [
            { label: 'Button', value: 'ui-button', symbol: '⚫' },
            { label: 'Input Field', value: 'ui-input', symbol: '▭' },
            { label: 'Card', value: 'ui-card', symbol: '▢' },
            { label: 'Header', value: 'ui-header', symbol: '━' },
            { label: 'Sidebar', value: 'ui-sidebar', symbol: '┃' },
            { type: 'separator' },
            { label: 'Layouts', value: 'layout-header', isHeader: true },
            { label: 'Grid Layout', value: 'layout-grid', symbol: '⊞' },
            { label: 'Flex Layout', value: 'layout-flex', symbol: '▭' },
          ],
        };

      case 'template-physics':
        return {
          icon: Atom,
          label: 'Physics Tools',
          color: 'text-red-600',
          items: [
            { label: 'Add Vector', value: 'vector', symbol: '→' },
            { label: 'Add Force Arrow', value: 'force', symbol: '⇒' },
            { label: 'Add Coordinate Axes', value: 'axes', symbol: '⊥' },
            { label: 'Add Object', value: 'object', symbol: '●' },
            { type: 'separator' },
            { label: 'Common Symbols', value: 'physics-header', isHeader: true },
            { label: 'Velocity (v)', value: 'symbol-v', symbol: 'v' },
            { label: 'Acceleration (a)', value: 'symbol-a', symbol: 'a' },
            { label: 'Force (F)', value: 'symbol-f', symbol: 'F' },
            { label: 'Mass (m)', value: 'symbol-m', symbol: 'm' },
            { label: 'Theta (θ)', value: 'symbol-theta', symbol: 'θ' },
          ],
        };

      case 'template-chemistry':
        return {
          icon: Atom,
          label: 'Chemistry Tools',
          color: 'text-green-600',
          items: [
            { label: 'Chemical Equations', value: 'chem-header', isHeader: true },
            { label: 'H₂O → H₂ + O₂', value: 'equation-h2o', symbol: 'H₂O → H₂ + O₂' },
            { label: '2H₂ + O₂ → 2H₂O', value: 'equation-water', symbol: '2H₂ + O₂ → 2H₂O' },
            { label: 'NaCl → Na⁺ + Cl⁻', value: 'equation-nacl', symbol: 'NaCl → Na⁺ + Cl⁻' },
            { label: 'CO₂ + H₂O → H₂CO₃', value: 'equation-co2', symbol: 'CO₂ + H₂O → H₂CO₃' },
            { type: 'separator' },
            { label: 'Common Elements', value: 'elements-header', isHeader: true },
            { label: 'Hydrogen (H)', value: 'symbol-h', symbol: 'H' },
            { label: 'Oxygen (O)', value: 'symbol-o', symbol: 'O' },
            { label: 'Carbon (C)', value: 'symbol-c', symbol: 'C' },
            { label: 'Nitrogen (N)', value: 'symbol-n', symbol: 'N' },
            { type: 'separator' },
            { label: 'Subscripts & Symbols', value: 'sub-header', isHeader: true },
            { label: 'Subscript 2 (₂)', value: 'symbol-sub2', symbol: '₂' },
            { label: 'Subscript 3 (₃)', value: 'symbol-sub3', symbol: '₃' },
            { label: 'Arrow (→)', value: 'symbol-arrow', symbol: '→' },
            { label: 'Equilibrium (⇌)', value: 'symbol-equilibrium', symbol: '⇌' },
            { label: 'Plus (+)', value: 'symbol-plus', symbol: '+' },
          ],
        };

      case 'template-calculus':
        return {
          icon: Calculator,
          label: 'Calculus Tools',
          color: 'text-purple-600',
          items: [
            { label: 'Derivatives', value: 'deriv-header', isHeader: true },
            { label: "f'(x) = ...", value: 'equation-deriv1', symbol: "f'(x) = " },
            { label: 'd/dx [f(x)]', value: 'equation-deriv2', symbol: 'd/dx [f(x)]' },
            { label: 'dy/dx = ', value: 'equation-deriv3', symbol: 'dy/dx = ' },
            { type: 'separator' },
            { label: 'Integrals', value: 'integral-header', isHeader: true },
            { label: '∫ f(x) dx', value: 'equation-int1', symbol: '∫ f(x) dx' },
            { label: '∫₀^∞ f(x) dx', value: 'equation-int2', symbol: '∫₀^∞ f(x) dx' },
            { type: 'separator' },
            { label: 'Common Formulas', value: 'formulas-header', isHeader: true },
            { label: 'd/dx [xⁿ] = nxⁿ⁻¹', value: 'equation-power', symbol: 'd/dx [xⁿ] = nxⁿ⁻¹' },
            { label: 'd/dx [sin x] = cos x', value: 'equation-sin', symbol: 'd/dx [sin x] = cos x' },
            { label: 'd/dx [eˣ] = eˣ', value: 'equation-exp', symbol: 'd/dx [eˣ] = eˣ' },
            { label: 'lim x→a f(x)', value: 'equation-limit', symbol: 'lim x→a f(x)' },
          ],
        };

      case 'template-quadratic':
        return {
          icon: Calculator,
          label: 'Quadratic Tools',
          color: 'text-orange-600',
          items: [
            { label: 'Quadratic Formulas', value: 'quad-header', isHeader: true },
            { label: 'ax² + bx + c = 0', value: 'equation-quad-std', symbol: 'ax² + bx + c = 0' },
            { label: 'x = (-b ± √(b²-4ac))/2a', value: 'equation-quad-formula', symbol: 'x = (-b ± √(b²-4ac))/2a' },
            { label: 'Δ = b² - 4ac', value: 'equation-disc', symbol: 'Δ = b² - 4ac' },
            { type: 'separator' },
            { label: 'Factored Forms', value: 'factor-header', isHeader: true },
            { label: 'a(x - r₁)(x - r₂)', value: 'equation-factored', symbol: 'a(x - r₁)(x - r₂)' },
            { label: 'x² - 5x + 6 = 0', value: 'equation-ex1', symbol: 'x² - 5x + 6 = 0' },
            { label: 'x² + 2x - 8 = 0', value: 'equation-ex2', symbol: 'x² + 2x - 8 = 0' },
          ],
        };

      case 'template-mindmap':
        return {
          icon: Brain,
          label: 'Mind Map Tools',
          color: 'text-pink-600',
          items: [
            { label: 'Add Central Topic', value: 'node-central', symbol: '◉', color: 'yellow' },
            { label: 'Add Main Branch', value: 'node-main', symbol: '○', color: 'blue' },
            { label: 'Add Sub-Branch', value: 'node-sub', symbol: '●', color: 'green' },
            { label: 'Add Connector', value: 'connector', symbol: '→' },
            { type: 'separator' },
            { label: 'Color Nodes', value: 'color-header', isHeader: true },
            { label: 'Red Node', value: 'node-red', symbol: '●', color: 'red' },
            { label: 'Blue Node', value: 'node-blue', symbol: '●', color: 'blue' },
            { label: 'Green Node', value: 'node-green', symbol: '●', color: 'green' },
            { label: 'Yellow Node', value: 'node-yellow', symbol: '●', color: 'yellow' },
          ],
        };

      case 'template-flowchart':
        return {
          icon: GitBranch,
          label: 'Flowchart Tools',
          color: 'text-cyan-600',
          items: [
            { label: 'Shapes', value: 'shapes-header', isHeader: true },
            { label: 'Start/End (Oval)', value: 'flow-terminal', symbol: '⬭', color: 'green' },
            { label: 'Process (Rectangle)', value: 'flow-process', symbol: '▭', color: 'blue' },
            { label: 'Decision (Diamond)', value: 'flow-decision', symbol: '◇', color: 'yellow' },
            { label: 'Input/Output', value: 'flow-io', symbol: '▱', color: 'orange' },
            { type: 'separator' },
            { label: 'Connectors', value: 'connect-header', isHeader: true },
            { label: 'Arrow Down', value: 'symbol-down', symbol: '↓' },
            { label: 'Arrow Right', value: 'symbol-right', symbol: '→' },
            { label: 'Yes/No', value: 'flow-yesno', symbol: 'Yes / No' },
          ],
        };

      case 'template-cornell':
        return {
          icon: BookOpen,
          label: 'Cornell Notes',
          color: 'text-amber-600',
          items: [
            { label: 'Sections', value: 'section-header', isHeader: true },
            { label: 'Cue Column', value: 'cornell-cue', symbol: 'Cue:', color: 'blue' },
            { label: 'Notes Section', value: 'cornell-notes', symbol: 'Notes:', color: 'grey' },
            { label: 'Summary', value: 'cornell-summary', symbol: 'Summary:', color: 'green' },
            { type: 'separator' },
            { label: 'Quick Notes', value: 'quick-header', isHeader: true },
            { label: 'Key Point', value: 'note-key', symbol: '★' },
            { label: 'Question', value: 'note-question', symbol: '?' },
            { label: 'Important', value: 'note-important', symbol: '!' },
            { label: 'Definition', value: 'note-definition', symbol: '≝' },
          ],
        };

      default:
        return null;
    }
  };

  const config = getTemplateConfig();

  // Don't render if no template or blank template
  if (!config || !templateId || templateId === 'template-blank') {
    return null;
  }

  const Icon = config.icon;

  const handleItemClick = (item: any) => {
    if (item.type === 'separator' || item.isHeader) return;
    
    onInsertComponent(item.value, {
      symbol: item.symbol,
      label: item.label,
      color: item.color,
    });
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-2 ${config.color} hover:bg-slate-50`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{config.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className={`flex items-center gap-2 ${config.color}`}>
          <Icon className="w-4 h-4" />
          {config.label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {config.items.map((item: any, index: number) => {
          if (item.type === 'separator') {
            return <DropdownMenuSeparator key={`sep-${index}`} />;
          }

          if (item.isHeader) {
            return (
              <DropdownMenuLabel
                key={`header-${index}`}
                className="text-xs font-semibold text-slate-500 uppercase tracking-wide"
              >
                {item.label}
              </DropdownMenuLabel>
            );
          }

          return (
            <DropdownMenuItem
              key={item.value}
              onClick={() => handleItemClick(item)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{item.label}</span>
              {item.symbol && (
                <span
                  className={`ml-2 font-mono text-lg ${
                    item.color ? `text-${item.color}-600` : 'text-slate-600'
                  }`}
                >
                  {item.symbol}
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
